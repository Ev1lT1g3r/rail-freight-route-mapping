// Export utilities for submissions
import { stations } from '../data/railNetwork';

export function exportSubmissionToJSON(submission) {
  const dataStr = JSON.stringify(submission, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `submission_${submission.id}_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSubmissionToCSV(submission) {
  const rows = [
    ['Field', 'Value'],
    ['ID', submission.id],
    ['Name', submission.name || ''],
    ['Status', submission.status],
    ['Origin', submission.origin],
    ['Destination', submission.destination],
    ['Created Date', submission.createdDate || ''],
    ['Created By', submission.createdBy || ''],
    ['Submitted Date', submission.submittedDate || ''],
    ['Submitted By', submission.submittedBy || ''],
    ['Approved Date', submission.approvedDate || ''],
    ['Approved By', submission.approvedBy || ''],
    ['Rejected Date', submission.rejectedDate || ''],
    ['Rejected By', submission.rejectedBy || ''],
    ['Rejection Reason', submission.rejectionReason || ''],
    ['Total Distance', submission.selectedRoute?.totalDistance || ''],
    ['Operators', submission.selectedRoute?.operators?.join(', ') || ''],
    ['Transfers', submission.selectedRoute?.transferPoints?.length || 0],
    ['States', submission.selectedRoute?.states?.join(', ') || ''],
    ['Freight Description', submission.freight?.description || ''],
    ['Freight Length', submission.freight?.length || ''],
    ['Freight Width', submission.freight?.width || ''],
    ['Freight Height', submission.freight?.height || ''],
    ['Freight Weight', submission.freight?.weight || ''],
    ['Tags', submission.tags?.join(', ') || ''],
    ['Notes', submission.notes || '']
  ];

  const csvContent = rows.map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');

  const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `submission_${submission.id}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSubmissionsToCSV(submissions) {
  if (!submissions || submissions.length === 0) {
    return;
  }

  const headers = [
    'ID', 'Name', 'Status', 'Origin', 'Destination', 'Created Date', 'Created By',
    'Submitted Date', 'Submitted By', 'Approved Date', 'Approved By',
    'Total Distance', 'Operators', 'Transfers', 'States', 'Tags', 'Notes'
  ];

  const rows = submissions.map(sub => [
    sub.id,
    sub.name || '',
    sub.status,
    sub.origin,
    sub.destination,
    sub.createdDate || '',
    sub.createdBy || '',
    sub.submittedDate || '',
    sub.submittedBy || '',
    sub.approvedDate || '',
    sub.approvedBy || '',
    sub.selectedRoute?.totalDistance || '',
    sub.selectedRoute?.operators?.join('; ') || '',
    sub.selectedRoute?.transferPoints?.length || 0,
    sub.selectedRoute?.states?.join('; ') || '',
    sub.tags?.join('; ') || '',
    sub.notes || ''
  ]);

  const csvContent = [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    )
  ].join('\n');

  const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `submissions_export_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSubmissionToText(submission) {
  const originStation = stations[submission.origin];
  const destStation = stations[submission.destination];

  const text = `
RAIL FREIGHT ROUTE SUBMISSION REPORT
=====================================

Submission Information
----------------------
ID: ${submission.id}
Name: ${submission.name || 'N/A'}
Status: ${submission.status}
Created: ${submission.createdDate ? new Date(submission.createdDate).toLocaleString() : 'N/A'}
Created By: ${submission.createdBy || 'N/A'}

Route Information
-----------------
Origin: ${originStation?.name || submission.origin} (${submission.origin})
Destination: ${destStation?.name || submission.destination} (${submission.destination})

${submission.selectedRoute ? `
Selected Route Details
----------------------
Total Distance: ${submission.selectedRoute.totalDistance} miles
Operators: ${submission.selectedRoute.operators?.join(', ') || 'N/A'}
Number of Transfers: ${submission.selectedRoute.transferPoints?.length || 0}
States Traversed: ${submission.selectedRoute.states?.join(', ') || 'N/A'}
Total Curves: ${submission.selectedRoute.totalCurves || 0}
Route Cost Score: ${submission.selectedRoute.totalCost || 'N/A'}

Route Segments:
${submission.selectedRoute.segments?.map((seg, idx) => 
  `  ${idx + 1}. ${seg.from} → ${seg.to} (${seg.distance} miles, ${seg.operator}, ${seg.curves || 0} curves)`
).join('\n') || '  N/A'}

Transfer Points:
${submission.selectedRoute.transferPoints?.map((tp, idx) => 
  `  ${idx + 1}. ${tp.station} (${tp.fromOperator} → ${tp.toOperator})`
).join('\n') || '  None'}
` : 'No route selected'}

Freight Information
-------------------
${submission.freight ? `
Description: ${submission.freight.description || 'N/A'}
Dimensions: ${submission.freight.length || 0} × ${submission.freight.width || 0} × ${submission.freight.height || 0} ${submission.freight.unitSystem === 'metric' ? 'meters' : 'feet'}
Weight: ${submission.freight.weight || 0} ${submission.freight.unitSystem === 'metric' ? 'kilograms' : 'pounds'}
` : 'No freight specified'}

Workflow Information
-------------------
${submission.submittedDate ? `Submitted: ${new Date(submission.submittedDate).toLocaleString()} by ${submission.submittedBy || 'N/A'}\n` : ''}
${submission.approvedDate ? `Approved: ${new Date(submission.approvedDate).toLocaleString()} by ${submission.approvedBy || 'N/A'}\n${submission.approvalComment ? `Approval Comment: ${submission.approvalComment}\n` : ''}` : ''}
${submission.rejectedDate ? `Rejected: ${new Date(submission.rejectedDate).toLocaleString()} by ${submission.rejectedBy || 'N/A'}\nRejection Reason: ${submission.rejectionReason || 'N/A'}\n` : ''}

${submission.tags && submission.tags.length > 0 ? `Tags: ${submission.tags.join(', ')}\n` : ''}
${submission.notes ? `Notes: ${submission.notes}\n` : ''}

Generated: ${new Date().toLocaleString()}
`;

  const dataBlob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `submission_${submission.id}_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

