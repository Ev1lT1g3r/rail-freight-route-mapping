import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import HelpTooltip from './HelpTooltip';
import { 
  getAllFreightItems, 
  saveFreightItem, 
  deleteFreightItem, 
  searchFreightItems,
  getFreightCategories,
  getFreightItemsByCategory,
  createFreightItemFromSpec
} from '../utils/freightLibrary';
import { getLengthUnitLabel, getWeightUnitLabel } from '../utils/unitConverter';
import { UNIT_SYSTEMS } from '../utils/unitConverter';

function FreightLibrary({ freight, onSelectFreight, onClose, currentUser = 'Current User' }) {
  const { success, error: showError } = useToast();
  const [freightItems, setFreightItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'General',
    description: '',
    tags: [],
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    diagram: null
  });

  useEffect(() => {
    loadFreightItems();
  }, []);

  const loadFreightItems = () => {
    const items = getAllFreightItems();
    setFreightItems(items);
  };

  const filteredItems = () => {
    let items = freightItems;
    
    if (selectedCategory !== 'all') {
      items = getFreightItemsByCategory(selectedCategory);
    }
    
    if (searchQuery.trim()) {
      items = searchFreightItems(searchQuery);
      if (selectedCategory !== 'all') {
        items = items.filter(item => item.category === selectedCategory);
      }
    }
    
    return items;
  };

  const categories = getFreightCategories();
  const displayItems = filteredItems();

  const handleSaveItem = () => {
    if (!newItem.name || !newItem.name.trim()) {
      showError('Please enter a name for the freight item');
      return;
    }

    if (newItem.length <= 0 || newItem.width <= 0 || newItem.height <= 0) {
      showError('Please enter valid dimensions');
      return;
    }

    const itemToSave = editingItem 
      ? { ...editingItem, ...newItem, updatedDate: new Date().toISOString() }
      : createFreightItemFromSpec(newItem, newItem.name, newItem.category, newItem.description, newItem.tags);

    if (itemToSave) {
      const itemId = saveFreightItem(itemToSave);
      if (itemId) {
        success(editingItem ? 'Freight item updated!' : 'Freight item saved to library!');
        loadFreightItems();
        setShowAddForm(false);
        setEditingItem(null);
        setNewItem({
          name: '',
          category: 'General',
          description: '',
          tags: [],
          length: 0,
          width: 0,
          height: 0,
          weight: 0,
          diagram: null
        });
      } else {
        showError('Error saving freight item');
      }
    }
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Delete this freight item from the library?')) {
      if (deleteFreightItem(id)) {
        success('Freight item deleted');
        loadFreightItems();
      }
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      category: item.category || 'General',
      description: item.description || '',
      tags: item.tags || [],
      length: item.length || 0,
      width: item.width || 0,
      height: item.height || 0,
      weight: item.weight || 0,
      diagram: item.diagram || null
    });
    setShowAddForm(true);
  };

  const handleLoadFromCurrent = () => {
    if (!freight || !freight.length || !freight.width || !freight.height) {
      showError('Please specify freight dimensions first');
      return;
    }

    setNewItem({
      name: freight.description || 'New Freight Item',
      category: 'General',
      description: freight.description || '',
      tags: [],
      length: freight.length || 0,
      width: freight.width || 0,
      height: freight.height || 0,
      weight: freight.weight || 0,
      diagram: freight.diagram || null
    });
    setShowAddForm(true);
  };

  const handleSelectItem = (item) => {
    if (onSelectFreight) {
      onSelectFreight({
        description: item.name,
        length: item.length,
        width: item.width,
        height: item.height,
        weight: item.weight,
        diagram: item.diagram,
        unitSystem: UNIT_SYSTEMS.IMPERIAL
      });
      success('Freight item loaded!');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '1200px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#0F172A' }}>
              Freight Library
            </h2>
            <p style={{ margin: '8px 0 0 0', color: '#6B7280', fontSize: '14px' }}>
              Manage your freight catalog - save, search, and reuse common freight specifications
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleLoadFromCurrent}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              💾 Save Current
            </button>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingItem(null);
                setNewItem({
                  name: '',
                  category: 'General',
                  description: '',
                  tags: [],
                  length: 0,
                  width: 0,
                  height: 0,
                  weight: 0,
                  diagram: null
                });
              }}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {showAddForm ? 'Cancel' : '+ New Item'}
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#F8F9FA', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
              {editingItem ? 'Edit Freight Item' : 'Add New Freight Item'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600' }}>
                  Name *
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g., Standard Steel Coil"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600' }}>
                  Category
                </label>
                <input
                  type="text"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  placeholder="e.g., Steel, Machinery, Containers"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600' }}>
                Description
              </label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Optional description"
                rows={2}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600' }}>
                  Length (ft) *
                </label>
                <input
                  type="number"
                  value={newItem.length || ''}
                  onChange={(e) => setNewItem({ ...newItem, length: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.1"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600' }}>
                  Width (ft) *
                </label>
                <input
                  type="number"
                  value={newItem.width || ''}
                  onChange={(e) => setNewItem({ ...newItem, width: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.1"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600' }}>
                  Height (ft) *
                </label>
                <input
                  type="number"
                  value={newItem.height || ''}
                  onChange={(e) => setNewItem({ ...newItem, height: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.1"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600' }}>
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  value={newItem.weight || ''}
                  onChange={(e) => setNewItem({ ...newItem, weight: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="100"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                }}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  backgroundColor: '#6B7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {editingItem ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search freight items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '14px',
              minWidth: '150px'
            }}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Freight Items List */}
        {displayItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>No Freight Items Yet</h4>
            <p style={{ margin: '0 0 20px 0', fontSize: '14px' }}>
              {searchQuery || selectedCategory !== 'all' 
                ? 'No items match your search criteria'
                : 'Start building your freight library by saving common freight specifications'}
            </p>
            {!searchQuery && selectedCategory === 'all' && (
              <button
                onClick={() => setShowAddForm(true)}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Add First Item
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {displayItems.map(item => (
              <div
                key={item.id}
                style={{
                  padding: '16px',
                  backgroundColor: '#F8F9FA',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>
                        {item.name}
                      </h4>
                      {item.category && (
                        <span style={{ fontSize: '12px', color: '#6B7280', backgroundColor: '#E5E7EB', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>
                  {item.description && (
                    <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#6B7280' }}>
                      {item.description}
                    </p>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>
                  <div><strong>Dimensions:</strong> {item.length.toFixed(1)} × {item.width.toFixed(1)} × {item.height.toFixed(1)} ft</div>
                  {item.weight > 0 && (
                    <div><strong>Weight:</strong> {item.weight.toFixed(0)} lbs</div>
                  )}
                  <div><strong>Volume:</strong> {(item.length * item.width * item.height).toFixed(1)} ft³</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <button
                    onClick={() => handleSelectItem(item)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      backgroundColor: '#8B5CF6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleEditItem(item)}
                    style={{
                      padding: '8px 12px',
                      fontSize: '14px',
                      backgroundColor: '#3B82F6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    style={{
                      padding: '8px 12px',
                      fontSize: '14px',
                      backgroundColor: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FreightLibrary;

