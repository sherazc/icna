
function switchScreen(screenId) {
  // Hide all screens
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.remove('active'));

  // Show selected screen
  const selectedScreen = document.getElementById(screenId);
  if (selectedScreen) {
    selectedScreen.classList.add('active');
  }

  // Update active nav link
  const navLinks = document.querySelectorAll('.navLink');
  navLinks.forEach(link => link.classList.remove('active'));
  const activeLink = document.querySelector(`[onclick="switchScreen('${screenId}')"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }

  // Close mobile menu when switching screens
  closeMobileMenu();
}

function toggleMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.querySelector('.sidebarOverlay');
  const hamburgerBtn = document.querySelector('.hamburgerBtn');

  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
  hamburgerBtn.classList.toggle('active');
}

function closeMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.querySelector('.sidebarOverlay');
  const hamburgerBtn = document.querySelector('.hamburgerBtn');

  sidebar.classList.remove('active');
  overlay.classList.remove('active');
  hamburgerBtn.classList.remove('active');
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
  }
}

// Configurable Modal System
let modalConfig = {
  title: '',
  message: '',
  type: 'confirm', // 'confirm', 'warning', 'error'
  okLabel: 'OK',
  okFunction: null,
  cancelLabel: null,
  cancelFunction: null,
  closeFunction: null
};

function showModal(config) {
  // Update modal config
  modalConfig = {
    title: config.title || 'Modal',
    message: config.message || '',
    type: config.type || 'confirm',
    okLabel: config.okLabel || 'OK',
    okFunction: config.okFunction || null,
    cancelLabel: config.cancelLabel || null,
    cancelFunction: config.cancelFunction || null,
    closeFunction: config.closeFunction || null
  };

  // Update modal elements
  document.getElementById('modalTitle').textContent = modalConfig.title;
  document.getElementById('modalMessage').textContent = modalConfig.message;

  // Update OK button
  document.getElementById('modalOkBtn').textContent = modalConfig.okLabel;
  document.getElementById('modalOkBtn').onclick = handleModalOk;

  // Update cancel button visibility
  const cancelBtn = document.getElementById('modalCancelBtn');
  if (modalConfig.cancelLabel) {
    cancelBtn.style.display = 'block';
    cancelBtn.textContent = modalConfig.cancelLabel;
  } else {
    cancelBtn.style.display = 'none';
  }

  // Set modal type styling
  const modal = document.getElementById('configModal');
  modal.classList.remove('confirm', 'warning', 'error');
  modal.classList.add(modalConfig.type);

  // Show modal
  openModal('configModal');
}

function handleModalOk() {
  if (modalConfig.okFunction && typeof modalConfig.okFunction === 'function') {
    modalConfig.okFunction();
  }
  closeConfigModal();
}

function handleModalCancel() {
  if (modalConfig.cancelFunction && typeof modalConfig.cancelFunction === 'function') {
    modalConfig.cancelFunction();
  }
  closeConfigModal();
}

function closeConfigModal() {
  if (modalConfig.closeFunction && typeof modalConfig.closeFunction === 'function') {
    modalConfig.closeFunction();
  }
  closeModal('configModal');
}

// Preset Modal Examples
function showConfirmModal() {
  showModal({
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed with this action?',
    type: 'confirm',
    okLabel: 'Yes',
    okFunction: () => {
      console.log('Confirm action accepted');
      alert('Action confirmed!');
    },
    cancelLabel: 'No',
    cancelFunction: () => {
      console.log('Confirm action cancelled');
    }
  });
}

function showWarningModal() {
  showModal({
    title: 'Warning',
    message: 'This action cannot be undone. Please proceed with caution.',
    type: 'warning',
    okLabel: 'I Understand',
    okFunction: () => {
      console.log('Warning acknowledged');
      alert('Warning acknowledged!');
    },
    cancelLabel: 'Cancel',
    cancelFunction: () => {
      console.log('Warning cancelled');
    }
  });
}

function showErrorModal() {
  showModal({
    title: 'Error',
    message: 'An error occurred. Please try again later.',
    type: 'error',
    okLabel: 'Dismiss',
    okFunction: () => {
      console.log('Error dismissed');
    }
  });
}

function showCustomModal() {
  showModal({
    title: 'Delete Appointment',
    message: 'Are you sure you want to delete this appointment? This cannot be undone.',
    type: 'error',
    okLabel: 'Delete',
    okFunction: () => {
      console.log('Appointment deleted');
      alert('Appointment deleted successfully!');
    },
    cancelLabel: 'Keep it',
    cancelFunction: () => {
      console.log('Delete cancelled');
      alert('Appointment kept safe!');
    },
    closeFunction: () => {
      console.log('Modal closed by close button');
    }
  });
}

let currentOrganization = null;
let userRole = null;

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const organization = document.getElementById('organization').value;
  const role = document.getElementById('role').value;

  currentOrganization = organization;
  userRole = role;

  // Show/hide super admin features
  const superAdminElements = document.querySelectorAll('.superAdminOnly');
  superAdminElements.forEach(el => {
    if (role === 'super-admin') {
      el.classList.add('show');
    } else {
      el.classList.remove('show');
    }
  });

  alert(`Logged in as ${role} for ${getOrganizationName(organization)}: ${email}`);

  if (role === 'super-admin') {
    switchScreen('org-management');
  } else {
    switchScreen('org-selection');
  }
}

function getOrganizationName(orgId) {
  const orgNames = {
    'mercy-clinic': 'Mercy Free Clinic',
    'hope-center': 'Hope Community Center',
    'faith-health': 'Faith & Health Alliance'
  };
  return orgNames[orgId] || orgId;
}

function switchOrganization() {
  const selector = document.getElementById('orgSelector');
  const selectedOrg = selector.value;
  if (selectedOrg) {
    currentOrganization = selectedOrg;
    updateOrganizationDisplay();
  }
}

function selectOrganization(orgId) {
  currentOrganization = orgId;
  document.getElementById('orgSelector').value = orgId;
  updateOrganizationDisplay();
  switchScreen('dashboard');
}

function updateOrganizationDisplay() {
  const orgName = getOrganizationName(currentOrganization);
  const badges = document.querySelectorAll('#currentOrgBadge, #orgSettingsBadge');
  badges.forEach(badge => {
    badge.textContent = orgName;
  });
}

function handleOrgRegistration(event) {
  event.preventDefault();
  const orgName = document.getElementById('orgName').value;
  alert(`Organization "${orgName}" registered successfully!`);
  switchScreen('login');
}

function updateColorPreview(inputId, previewId) {
  const colorInput = document.getElementById(inputId);
  const colorPreview = document.getElementById(previewId);
  const colorValue = document.getElementById(inputId.replace('Color', 'ColorValue'));

  if (colorInput && colorPreview) {
    const hexColor = colorInput.value.toUpperCase();
    colorPreview.style.background = hexColor;
    if (colorValue) {
      colorValue.textContent = hexColor;
    }
  }
}

function handleAddOrganization(event) {
  event.preventDefault();
  alert('Organization added successfully!');
  closeModal('addOrgModal');
  event.target.reset();
}

function selectRow(rowElement, clinicDate) {
  // Remove selection from all rows
  const allRows = document.querySelectorAll('tbody tr');
  allRows.forEach(row => {
    row.classList.remove('selected');
  });

  // Add selection to clicked row
  rowElement.classList.add('selected');

  // Clear search inputs
  const providerSearch = document.getElementById('provider-search');
  const volunteerSearch = document.getElementById('volunteer-search');
  if (providerSearch) providerSearch.value = '';
  if (volunteerSearch) volunteerSearch.value = '';

  // Sample data for each clinic date
  const clinicData = {
    'Nov 30, 2025': {
      status: 'Scheduled',
      providers: [
        { name: 'Dr. Sarah Johnson', role: 'General Medicine' },
        { name: 'Dr. Michael Chen', role: 'Pediatrics' },
        { name: 'Dr. Patricia Williams', role: 'Cardiology' },
        { name: 'Dr. James Martinez', role: 'Family Medicine' }
      ],
      volunteers: [
        { name: 'James Rodriguez', role: 'Registration' },
        { name: 'Emma Thompson', role: 'Patient Support' },
        { name: 'David Kim', role: 'Data Entry' },
        { name: 'Lisa Anderson', role: 'Patient Support' },
        { name: 'Maria Garcia', role: 'Translation' },
        { name: 'Robert Johnson', role: 'Logistics' },
        { name: 'Jennifer Lee', role: 'Intake' },
        { name: 'Christopher Brown', role: 'Setup/Cleanup' }
      ]
    },
    'Dec 7, 2025': {
      status: 'Scheduled',
      providers: [
        { name: 'Dr. Sarah Johnson', role: 'General Medicine' },
        { name: 'Dr. Michael Chen', role: 'Pediatrics' },
        { name: 'Dr. Robert Brown', role: 'Internal Medicine' }
      ],
      volunteers: [
        { name: 'James Rodriguez', role: 'Registration' },
        { name: 'David Kim', role: 'Data Entry' },
        { name: 'Maria Garcia', role: 'Translation' },
        { name: 'Jennifer Lee', role: 'Intake' },
        { name: 'Christopher Brown', role: 'Setup/Cleanup' },
        { name: 'Emma Thompson', role: 'Patient Support' }
      ]
    },
    'Dec 14, 2025': {
      status: 'Pending',
      providers: [
        { name: 'Dr. Patricia Williams', role: 'Cardiology' },
        { name: 'Dr. James Martinez', role: 'Family Medicine' }
      ],
      volunteers: [
        { name: 'Emma Thompson', role: 'Patient Support' },
        { name: 'Lisa Anderson', role: 'Patient Support' },
        { name: 'Maria Garcia', role: 'Translation' },
        { name: 'Robert Johnson', role: 'Logistics' }
      ]
    },
    'Dec 21, 2025': {
      status: 'Scheduled',
      providers: [
        { name: 'Dr. Sarah Johnson', role: 'General Medicine' },
        { name: 'Dr. James Martinez', role: 'Family Medicine' },
        { name: 'Dr. John Smith', role: 'Internal Medicine' },
        { name: 'Dr. Michael Davis', role: 'Pediatrics' },
        { name: 'Dr. Elizabeth Wilson', role: 'General Medicine' }
      ],
      volunteers: [
        { name: 'James Rodriguez', role: 'Registration' },
        { name: 'Emma Thompson', role: 'Patient Support' },
        { name: 'David Kim', role: 'Data Entry' },
        { name: 'Maria Garcia', role: 'Translation' },
        { name: 'Robert Johnson', role: 'Logistics' },
        { name: 'Jennifer Lee', role: 'Intake' },
        { name: 'Christopher Brown', role: 'Setup/Cleanup' },
        { name: 'Lisa Anderson', role: 'Patient Support' },
        { name: 'Alex Martinez', role: 'Medical Assistant' },
        { name: 'Sarah White', role: 'Patient Support' }
      ]
    },
    'Dec 28, 2025': {
      status: 'Scheduled',
      providers: [
        { name: 'Dr. Michael Chen', role: 'Pediatrics' },
        { name: 'Dr. Patricia Williams', role: 'Cardiology' },
        { name: 'Dr. Robert Brown', role: 'Internal Medicine' }
      ],
      volunteers: [
        { name: 'Lisa Anderson', role: 'Patient Support' },
        { name: 'Jennifer Lee', role: 'Intake' },
        { name: 'Christopher Brown', role: 'Setup/Cleanup' },
        { name: 'Maria Garcia', role: 'Translation' },
        { name: 'James Rodriguez', role: 'Registration' },
        { name: 'Emma Thompson', role: 'Patient Support' },
        { name: 'Robert Johnson', role: 'Logistics' }
      ]
    },
    'Jan 4, 2026': {
      status: 'Pending',
      providers: [
        { name: 'Dr. Sarah Johnson', role: 'General Medicine' },
        { name: 'Dr. James Martinez', role: 'Family Medicine' },
        { name: 'Dr. Michael Taylor', role: 'Pediatrics' },
        { name: 'Dr. Elizabeth White', role: 'Cardiology' }
      ],
      volunteers: [
        { name: 'James Rodriguez', role: 'Registration' },
        { name: 'David Kim', role: 'Data Entry' },
        { name: 'Maria Garcia', role: 'Translation' },
        { name: 'Robert Johnson', role: 'Logistics' },
        { name: 'Jennifer Lee', role: 'Intake' },
        { name: 'Christopher Brown', role: 'Setup/Cleanup' },
        { name: 'Lisa Anderson', role: 'Patient Support' },
        { name: 'Emma Thompson', role: 'Patient Support' },
        { name: 'Alex Martinez', role: 'Medical Assistant' }
      ]
    },
    'Jan 11, 2026': {
      status: 'Pending',
      providers: [
        { name: 'Dr. Michael Davis', role: 'Pediatrics' },
        { name: 'Dr. Elizabeth Wilson', role: 'General Medicine' }
      ],
      volunteers: [
        { name: 'Lisa Anderson', role: 'Patient Support' },
        { name: 'Jennifer Lee', role: 'Intake' },
        { name: 'Christopher Brown', role: 'Setup/Cleanup' },
        { name: 'Sarah Clark', role: 'Patient Support' },
        { name: 'Michael Hall', role: 'Data Entry' }
      ]
    },
    'Jan 18, 2026': {
      status: 'Draft',
      providers: [
        { name: 'Dr. Sarah Johnson', role: 'General Medicine' },
        { name: 'Dr. Michael Chen', role: 'Pediatrics' },
        { name: 'Dr. James Martinez', role: 'Family Medicine' },
        { name: 'Dr. John Smith', role: 'Internal Medicine' },
        { name: 'Dr. Patricia Williams', role: 'Cardiology' },
        { name: 'Dr. Robert Brown', role: 'General Medicine' }
      ],
      volunteers: [
        { name: 'James Rodriguez', role: 'Registration' },
        { name: 'Emma Thompson', role: 'Patient Support' },
        { name: 'David Kim', role: 'Data Entry' },
        { name: 'Maria Garcia', role: 'Translation' },
        { name: 'Robert Johnson', role: 'Logistics' },
        { name: 'Jennifer Lee', role: 'Intake' },
        { name: 'Christopher Brown', role: 'Setup/Cleanup' },
        { name: 'Lisa Anderson', role: 'Patient Support' },
        { name: 'Alex Martinez', role: 'Medical Assistant' },
        { name: 'Sarah White', role: 'Patient Support' },
        { name: 'Sarah Clark', role: 'Patient Support' },
        { name: 'Michael Hall', role: 'Data Entry' }
      ]
    }
  };

  // Get data for selected clinic date
  const data = clinicData[clinicDate];

  // Update header with clinic date
  document.getElementById('selected-clinic-date').textContent = 'Clinic Day: ' + clinicDate;

  // Update and show status badge
  const statusBadge = document.getElementById('selected-clinic-status');
  const badgeClass = data.status.toLowerCase() === 'scheduled' ? 'badge-success' :
    data.status.toLowerCase() === 'pending' ? 'badge-warning' : 'badge-primary';
  statusBadge.className = `badge ${badgeClass}`;
  statusBadge.textContent = data.status;
  statusBadge.style.display = 'inline-block';

  // Update providers
  document.getElementById('detail-providers-count').textContent = data.providers.length;
  const providersList = document.getElementById('detail-providers-list');
  providersList.innerHTML = data.providers.length > 0 ? data.providers.map(provider =>
    `<li class="personItem">
                    <div class="flex flex-start gap-4 flex-1">
                        <span class="personName">${provider.name}</span>
                        <span class="personRole">${provider.role}</span>
                    </div>
                    <button type="button" class="personRemoveBtn" onclick="event.stopPropagation()" title="Remove provider">✕</button>
                </li>`
  ).join('') : `<li class="personItem">
                    <span class="personName">No providers assigned</span>
                </li>`;

  // Update volunteers
  document.getElementById('detail-volunteers-count').textContent = data.volunteers.length;
  const volunteersList = document.getElementById('detail-volunteers-list');
  volunteersList.innerHTML = data.volunteers.length > 0 ? data.volunteers.map(volunteer =>
    `<li class="personItem">
                    <div class="flex flex-start gap-4 flex-1">
                        <span class="personName">${volunteer.name}</span>
                        <span class="personRole">${volunteer.role}</span>
                    </div>
                    <button type="button" class="personRemoveBtn" onclick="event.stopPropagation()" title="Remove volunteer">✕</button>
                </li>`
  ).join('') : `<li class="personItem">
                    <span class="personName">No volunteers assigned</span>
                </li>`;

  // Collapse accordions
  const providersAccordion = document.getElementById('detail-providers-accordion');
  const volunteersAccordion = document.getElementById('detail-volunteers-accordion');
  if (providersAccordion.classList.contains('show')) {
    providersAccordion.classList.remove('show');
    document.getElementById('detail-providers-toggle').textContent = '▶';
  }
  if (volunteersAccordion.classList.contains('show')) {
    volunteersAccordion.classList.remove('show');
    document.getElementById('detail-volunteers-toggle').textContent = '▶';
  }
}

function toggleSpecialtyOther() {
  const specialtySelect = document.getElementById('specialtySelect');
  const otherInput = document.getElementById('specialtyOtherInput');
  const customSpecialtyInput = document.getElementById('customSpecialty');

  if (specialtySelect.value === 'Other') {
    otherInput.classList.add('show');
    customSpecialtyInput.required = true;
    customSpecialtyInput.focus();
  } else {
    otherInput.classList.remove('show');
    customSpecialtyInput.required = false;
    customSpecialtyInput.value = '';
  }
}

function toggleVolunteerTypeOther() {
  const volunteerTypeSelect = document.getElementById('volunteerTypeSelect');
  const otherInput = document.getElementById('volunteerTypeOtherInput');
  const customVolunteerTypeInput = document.getElementById('customVolunteerType');

  if (volunteerTypeSelect.value === 'Other') {
    otherInput.classList.add('show');
    customVolunteerTypeInput.required = true;
    customVolunteerTypeInput.focus();
  } else {
    otherInput.classList.remove('show');
    customVolunteerTypeInput.required = false;
    customVolunteerTypeInput.value = '';
  }
}





function handleAddProvider(event) {
  event.preventDefault();

  const specialtySelect = document.getElementById('specialtySelect');
  const customSpecialty = document.getElementById('customSpecialty');

  let finalSpecialty = specialtySelect.value;
  if (specialtySelect.value === 'Other' && customSpecialty.value.trim()) {
    finalSpecialty = customSpecialty.value.trim();
  }

  alert(`Provider added successfully with specialty: ${finalSpecialty}`);
  closeModal('addProviderModal');
  event.target.reset();

  // Reset specialty other input
  document.getElementById('specialtyOtherInput').classList.remove('show');
  customSpecialty.required = false;
  customSpecialty.value = '';

  // Refresh accordion if on dashboard
  updateDashboardAccordions();
}

function handleAddVolunteer(event) {
  event.preventDefault();

  const volunteerTypeSelect = document.getElementById('volunteerTypeSelect');
  const customVolunteerType = document.getElementById('customVolunteerType');

  let finalVolunteerType = volunteerTypeSelect.value;
  if (volunteerTypeSelect.value === 'Other' && customVolunteerType.value.trim()) {
    finalVolunteerType = customVolunteerType.value.trim();
  }

  alert(`Volunteer added successfully with type: ${finalVolunteerType}`);
  closeModal('addVolunteerModal');
  event.target.reset();

  // Reset volunteer type other input
  document.getElementById('volunteerTypeOtherInput').classList.remove('show');
  customVolunteerType.required = false;
  customVolunteerType.value = '';

  // Refresh accordion if on dashboard
  updateDashboardAccordions();
}

function updateDashboardAccordions() {
  // This function would typically refresh the accordion data from the server
  // For now, it's a placeholder for future implementation
  console.log('Refreshing dashboard accordions...');
}



function handleAddSchedule(event) {
  event.preventDefault();
  alert('Schedule created successfully!');
  closeModal('addScheduleModal');
  event.target.reset();
}

function handleAddClinic(event) {
  event.preventDefault();
  alert('Clinic date added successfully!');
  closeModal('addClinicModal');
  event.target.reset();
}

function toggleSignup() {
  alert('Sign up functionality would be implemented here');
}

// Close modal when clicking outside of it
window.onclick = function (event) {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('show');
  }
}

// Enable mouse drag scrolling for table containers
function initTableScrolling() {
  const scrollElements = document.querySelectorAll('.tableContainer, .tableScroll');

  scrollElements.forEach(element => {
    let isDown = false;
    let startX;
    let scrollLeft;
    let hasDragged = false;
    const dragThreshold = 5;

    element.addEventListener('mousedown', (e) => {
      if (e.target.closest('.actionBtn')) {
        return;
      }
      isDown = true;
      hasDragged = false;
      startX = e.pageX - element.getBoundingClientRect().left;
      scrollLeft = element.scrollLeft;
    });

    element.addEventListener('mouseleave', () => {
      isDown = false;
    });

    element.addEventListener('mouseup', () => {
      isDown = false;
    });

    element.addEventListener('mousemove', (e) => {
      if (!isDown) return;

      const x = e.pageX - element.getBoundingClientRect().left;
      const walk = (x - startX);

      if (Math.abs(walk) > dragThreshold) {
        hasDragged = true;
        e.preventDefault();
        element.scrollLeft = scrollLeft - walk;
      }
    });

    const rows = element.querySelectorAll('tbody tr');
    rows.forEach(row => {
      row.addEventListener('click', (e) => {
        if (hasDragged) {
          e.stopPropagation();
        }
      });
    });
  });
}

// Initialize table scrolling when page loads
document.addEventListener('DOMContentLoaded', initTableScrolling);

// Dropdown search functionality
const allProviders = [
  { name: 'Dr. Sarah Johnson', role: 'General Medicine' },
  { name: 'Dr. Michael Chen', role: 'Pediatrics' },
  { name: 'Dr. Patricia Williams', role: 'Cardiology' },
  { name: 'Dr. James Martinez', role: 'Family Medicine' },
  { name: 'Dr. Robert Brown', role: 'Internal Medicine' },
  { name: 'Dr. John Smith', role: 'Internal Medicine' },
  { name: 'Dr. Michael Davis', role: 'Pediatrics' },
  { name: 'Dr. Elizabeth Wilson', role: 'General Medicine' },
  { name: 'Dr. David Taylor', role: 'Surgery' },
  { name: 'Dr. Jennifer White', role: 'Orthopedics' }
];

const allVolunteers = [
  { name: 'James Rodriguez', role: 'Registration' },
  { name: 'Emma Thompson', role: 'Patient Support' },
  { name: 'David Kim', role: 'Data Entry' },
  { name: 'Maria Garcia', role: 'Translation' },
  { name: 'Robert Johnson', role: 'Logistics' },
  { name: 'Jennifer Lee', role: 'Intake' },
  { name: 'Christopher Brown', role: 'Setup/Cleanup' },
  { name: 'Lisa Anderson', role: 'Patient Support' },
  { name: 'Alex Martinez', role: 'Medical Assistant' },
  { name: 'Sarah White', role: 'Patient Support' }
];

function populateDropdown(searchTerm, allItems, dropdownId) {
  const dropdown = document.getElementById(dropdownId);

  if (!searchTerm.trim()) {
    // Show all items if no search term or empty search
    const filtered = allItems;
    if (filtered.length === 0) {
      dropdown.innerHTML = '<div class="p-12 text-secondary text-center">No results found</div>';
      dropdown.classList.add('show');
      return;
    }

    dropdown.innerHTML = filtered.map(item => `
                    <div class="searchDropdownItem">
                        <div class="dropdownItemInfo">
                            <div class="dropdownItemName">${item.name}</div>
                            <div class="dropdownItemRole">${item.role}</div>
                        </div>
                        <button type="button" class="dropdownItemAddBtn" onclick="event.stopPropagation();">Add</button>
                    </div>
                `).join('');
    dropdown.classList.add('show');
    return;
  }

  const filtered = allItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filtered.length === 0) {
    dropdown.innerHTML = '<div class="p-12 text-secondary text-center">No results found</div>';
    dropdown.classList.add('show');
    return;
  }

  dropdown.innerHTML = filtered.map(item => `
                <div class="searchDropdownItem">
                    <div class="dropdownItemInfo">
                        <div class="dropdownItemName">${item.name}</div>
                        <div class="dropdownItemRole">${item.role}</div>
                    </div>
                    <button type="button" class="dropdownItemAddBtn" onclick="event.stopPropagation();">Add</button>
                </div>
            `).join('');
  dropdown.classList.add('show');
}

// Provider search
document.getElementById('provider-search').addEventListener('input', (e) => {
  populateDropdown(e.target.value, allProviders, 'provider-dropdown');
});

// Volunteer search
document.getElementById('volunteer-search').addEventListener('input', (e) => {
  populateDropdown(e.target.value, allVolunteers, 'volunteer-dropdown');
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.searchWrapper')) {
    document.getElementById('provider-dropdown').classList.remove('show');
    document.getElementById('volunteer-dropdown').classList.remove('show');
  }
});

function toggleAllProviders() {
  const dropdown = document.getElementById('provider-dropdown');
  if (dropdown.classList.contains('show')) {
    dropdown.classList.remove('show');
  } else {
    populateDropdown('', allProviders, 'provider-dropdown');
  }
}

function toggleAllVolunteers() {
  const dropdown = document.getElementById('volunteer-dropdown');
  if (dropdown.classList.contains('show')) {
    dropdown.classList.remove('show');
  } else {
    populateDropdown('', allVolunteers, 'volunteer-dropdown');
  }
}

// Volunteer Reports functionality
let selectedReportVolunteer = null;

// Sample report data - in real app, this would come from backend
const volunteerWorkData = {
  'James Rodriguez': [
    { date: '2025-11-30', clinic: 'Mercy Free Clinic', role: 'Registration', hours: 8, status: 'Completed' },
    { date: '2025-12-07', clinic: 'Mercy Free Clinic', role: 'Registration', hours: 8, status: 'Completed' },
    { date: '2025-12-14', clinic: 'Mercy Free Clinic', role: 'Registration', hours: 8, status: 'Completed' }
  ],
  'Emma Thompson': [
    { date: '2025-11-30', clinic: 'Mercy Free Clinic', role: 'Patient Support', hours: 8, status: 'Completed' },
    { date: '2025-12-21', clinic: 'Mercy Free Clinic', role: 'Patient Support', hours: 8, status: 'Completed' }
  ],
  'David Kim': [
    { date: '2025-11-30', clinic: 'Mercy Free Clinic', role: 'Data Entry', hours: 6, status: 'Completed' },
    { date: '2025-12-07', clinic: 'Mercy Free Clinic', role: 'Data Entry', hours: 8, status: 'Completed' },
    { date: '2025-12-28', clinic: 'Mercy Free Clinic', role: 'Data Entry', hours: 8, status: 'Completed' }
  ],
  'Maria Garcia': [
    { date: '2025-12-21', clinic: 'Mercy Free Clinic', role: 'Translation', hours: 8, status: 'Completed' }
  ],
  'Robert Johnson': [
    { date: '2025-11-30', clinic: 'Mercy Free Clinic', role: 'Logistics', hours: 8, status: 'Completed' },
    { date: '2025-12-07', clinic: 'Mercy Free Clinic', role: 'Logistics', hours: 8, status: 'Completed' },
    { date: '2025-12-14', clinic: 'Mercy Free Clinic', role: 'Logistics', hours: 8, status: 'Completed' },
    { date: '2025-12-28', clinic: 'Mercy Free Clinic', role: 'Logistics', hours: 8, status: 'Completed' }
  ],
  'Jennifer Lee': [
    { date: '2025-12-07', clinic: 'Mercy Free Clinic', role: 'Intake', hours: 8, status: 'Completed' }
  ],
  'Christopher Brown': [
    { date: '2025-11-30', clinic: 'Mercy Free Clinic', role: 'Setup/Cleanup', hours: 4, status: 'Completed' },
    { date: '2025-12-21', clinic: 'Mercy Free Clinic', role: 'Setup/Cleanup', hours: 4, status: 'Completed' }
  ],
  'Lisa Anderson': [
    { date: '2025-12-28', clinic: 'Mercy Free Clinic', role: 'Patient Support', hours: 8, status: 'Completed' }
  ],
  'Alex Martinez': [
    { date: '2025-12-14', clinic: 'Mercy Free Clinic', role: 'Medical Assistant', hours: 8, status: 'Completed' },
    { date: '2025-01-04', clinic: 'Mercy Free Clinic', role: 'Medical Assistant', hours: 8, status: 'Scheduled' }
  ],
  'Sarah White': [
    { date: '2025-11-30', clinic: 'Mercy Free Clinic', role: 'Patient Support', hours: 8, status: 'Completed' },
    { date: '2025-12-21', clinic: 'Mercy Free Clinic', role: 'Patient Support', hours: 8, status: 'Completed' },
    { date: '2025-01-18', clinic: 'Mercy Free Clinic', role: 'Patient Support', hours: 8, status: 'Scheduled' }
  ]
};

function populateReportVolunteerDropdown(searchTerm) {
  const dropdown = document.getElementById('report-volunteer-dropdown');

  if (!searchTerm.trim()) {
    const filtered = allVolunteers;
    dropdown.innerHTML = filtered.map(vol => `
                    <div class="searchDropdownItem" onclick="selectReportVolunteer('${vol.name}', '${vol.role}')">
                        <div class="dropdownItemInfo">
                            <div class="dropdownItemName">${vol.name}</div>
                            <div class="dropdownItemRole">${vol.role}</div>
                        </div>
                    </div>
                `).join('');
    dropdown.classList.add('show');
    return;
  }

  const filtered = allVolunteers.filter(vol =>
    vol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vol.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  dropdown.innerHTML = filtered.map(vol => `
                <div class="searchDropdownItem" onclick="selectReportVolunteer('${vol.name}', '${vol.role}')">
                    <div class="dropdownItemInfo">
                        <div class="dropdownItemName">${vol.name}</div>
                        <div class="dropdownItemRole">${vol.role}</div>
                    </div>
                </div>
            `).join('');
  dropdown.classList.add('show');
}

function selectReportVolunteer(name, role) {
  selectedReportVolunteer = name;
  document.getElementById('report-volunteer-search').value = name;
  document.getElementById('selected-volunteer-name').textContent = `${name} (${role})`;
  document.getElementById('report-volunteer-dropdown').classList.remove('show');
}

function toggleReportVolunteers() {
  const dropdown = document.getElementById('report-volunteer-dropdown');
  if (dropdown.classList.contains('show')) {
    dropdown.classList.remove('show');
  } else {
    populateReportVolunteerDropdown('');
  }
}

document.getElementById('report-volunteer-search').addEventListener('input', (e) => {
  populateReportVolunteerDropdown(e.target.value);
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('report-volunteer-dropdown');
  const searchContainer = document.querySelector('#volunteer-reports .searchWrapper');
  if (!searchContainer?.contains(e.target)) {
    dropdown.classList.remove('show');
  }
});

function generateVolunteerReport() {
  if (!selectedReportVolunteer) {
    alert('Please select a volunteer first');
    return;
  }

  const startDate = document.getElementById('report-start-date').value;
  const endDate = document.getElementById('report-end-date').value;

  let workData = volunteerWorkData[selectedReportVolunteer] || [];

  // Filter by date range if specified
  if (startDate || endDate) {
    workData = workData.filter(item => {
      if (startDate && item.date < startDate) return false;
      if (endDate && item.date > endDate) return false;
      return true;
    });
  }

  // Update summary
  const totalDays = workData.length;
  const totalHours = workData.reduce((sum, item) => sum + item.hours, 0);

  document.getElementById('total-days-worked').textContent = totalDays;
  document.getElementById('total-hours-worked').textContent = totalHours;

  // Update table
  const tbody = document.getElementById('volunteer-report-results');
  if (workData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center p-3fullWidth text-secondary">No work records found for selected date range</td></tr>`;
    return;
  }

  tbody.innerHTML = workData.map(item => `
                <tr>
                    <td>${new Date(item.date).toLocaleDateString()}</td>
                    <td>${item.clinic}</td>
                    <td>${item.role}</td>
                    <td>${item.hours} hrs</td>
                    <td><span class="badge ${item.status === 'Completed' ? 'badgeSuccess' : 'badgeWarning'}">${item.status}</span></td>
                </tr>
            `).join('');
}

