// Storage utility for submission templates

const TEMPLATES_KEY = 'rail_freight_submission_templates';

export function getAllTemplates() {
  try {
    const stored = localStorage.getItem(TEMPLATES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading templates:', e);
    return [];
  }
}

export function getTemplateById(id) {
  const templates = getAllTemplates();
  return templates.find(t => t.id === id);
}

export function saveTemplate(template) {
  try {
    if (!template.name || !template.name.trim()) {
      console.error('Template must have a name');
      return false;
    }

    const templates = getAllTemplates();
    const existingIndex = templates.findIndex(t => t.id === template.id);
    
    const templateToSave = {
      ...template,
      id: template.id || `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      updatedDate: new Date().toISOString(),
      createdDate: template.createdDate || new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      templates[existingIndex] = templateToSave;
    } else {
      templates.push(templateToSave);
    }
    
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
    return templateToSave.id;
  } catch (e) {
    console.error('Error saving template:', e);
    return false;
  }
}

export function deleteTemplate(id) {
  try {
    const templates = getAllTemplates();
    const filtered = templates.filter(t => t.id !== id);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Error deleting template:', e);
    return false;
  }
}

export function createTemplateFromSubmission(submission, name) {
  try {
    return {
      name: name || `${submission.origin} → ${submission.destination} Template`,
      description: `Template based on submission from ${submission.origin} to ${submission.destination}`,
      origin: submission.origin,
      destination: submission.destination,
      preferences: submission.preferences,
      freight: submission.freight,
      tags: submission.tags || [],
      notes: submission.notes || '',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      createdBy: submission.createdBy || 'System'
    };
  } catch (e) {
    console.error('Error creating template from submission:', e);
    return null;
  }
}

