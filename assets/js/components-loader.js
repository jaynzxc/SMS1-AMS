function toggleSidebar() {
    const sidebar = document.getElementById('mainSidebar');
    if (!sidebar) return;
    
    // Toggle width
    if (sidebar.style.width === '64px' || sidebar.classList.contains('collapsed')) {
        // EXPAND
        sidebar.style.width = '256px';
        sidebar.classList.remove('collapsed');
        
        // Show all hidden elements
        sidebar.querySelectorAll('.sidebar-brand p, .sidebar-brand span, nav a span, nav button span, .dropdown-btn span:not(.arrow)').forEach(el => {
            el.style.display = '';
        });
        sidebar.querySelectorAll('.dropdown-arrow, .tardy-dropdown-arrow, .excuse-dropdown-arrow').forEach(el => {
            el.style.display = '';
        });
        // Show nav text
        sidebar.querySelectorAll('nav .sidebar-link span, nav .dropdown-toggle span').forEach(el => {
            el.style.display = '';
        });
    } else {
        // COLLAPSE
        sidebar.style.width = '64px';
        sidebar.classList.add('collapsed');
        
        // Hide ALL text elements
        sidebar.querySelectorAll('.sidebar-brand p, .sidebar-brand span, nav a span, nav button span, .dropdown-btn span:not(.arrow)').forEach(el => {
            el.style.display = 'none';
        });
        sidebar.querySelectorAll('.dropdown-arrow, .tardy-dropdown-arrow, .excuse-dropdown-arrow').forEach(el => {
            el.style.display = 'none';
        });
        // Hide nav text specifically
        sidebar.querySelectorAll('nav .sidebar-link span, nav .dropdown-toggle span').forEach(el => {
            el.style.display = 'none';
        });
    }
}