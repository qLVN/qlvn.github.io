
//YOU MIGHT HAVE NOTICED CODE STYLING CHANGED SINCE THE LAST COMMIT?
// KNOWING THIS PAGE WAS AN OLD MESS AND CONSIDERING I DID NOT HAVE ANY ENERGY TO REDO IT I TRIED GIVING IT TO GEMINI 2.5 PRO:
// IT WAS PERFECT AND PERFECTLY ADAPTED TO THE PAGE'S STYLE AND MADE ADJUSTMENTS/FIXES EXACTLY HAS I WANTED IT.
// MANY DEVELOPERS WILL LOSE THEIR JOBS....

document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const projectContents = document.querySelectorAll('.project-content');
    const selectDefault = document.getElementById('Select');
    const errorDefault = document.getElementById('error');
    const mobileBackButton = document.getElementById('mobile-back-button');
    const body = document.body;

    const MOBILE_BREAKPOINT = 900;

    // Function to hide all project contents
    function hideAllProjects() {
        projectContents.forEach(content => {
            content.classList.remove('active');
        });
    }

    // Function to show a specific project
    function showProject(targetId) {
        hideAllProjects();
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
            targetContent.classList.add('active');
            
            // On mobile, switch to project view
            if (window.innerWidth <= MOBILE_BREAKPOINT) {
                body.classList.add('mobile-project-view');
            }
            
            // Scroll the content pane to the top
            document.querySelector('.project-display').scrollTop = 0;
            return true;
        }
        return false;
    }
    
    // --- Event Listeners ---

    // Add click event listeners to nav items
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Prevent click if the function is handled by an inline onclick (like GitHub link)
            if(e.currentTarget.onclick) return;

            const targetId = item.getAttribute('data-target');
            
            // Update URL without reloading the page
            const url = new URL(window.location);
            url.searchParams.set('goto', targetId);
            window.history.pushState({}, '', url);

            showProject(targetId);
        });
    });

    // Mobile back button listener
    if (mobileBackButton) {
        mobileBackButton.addEventListener('click', () => {
            body.classList.remove('mobile-project-view');
            // After going back, show the default selection message
            hideAllProjects();
            selectDefault.classList.add('active');

            // Also remove the goto param from URL
            const url = new URL(window.location);
            url.searchParams.delete('goto');
            window.history.pushState({}, '', url);
        });
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const params = new URLSearchParams(window.location.search);
        const project = params.get('goto');
        if (project) {
            showProject(project);
        } else {
            // If we're back to a state with no 'goto' param
            hideAllProjects();
            selectDefault.classList.add('active');
            if (window.innerWidth <= MOBILE_BREAKPOINT) {
                body.classList.remove('mobile-project-view');
            }
        }
    });


    // --- Initial Page Load ---

    const urlParams = new URLSearchParams(window.location.search);
    const initialProject = urlParams.get('goto');

    if (initialProject) {
        // Attempt to show the project from the URL
        const projectFound = showProject(initialProject);
        if (!projectFound) {
            // If project not found, show error message
            hideAllProjects();
            errorDefault.classList.add('active');
            if (window.innerWidth <= MOBILE_BREAKPOINT) {
                body.classList.add('mobile-project-view');
            }
        }
    } else {
        // If no project specified, show the default "Select" message
        hideAllProjects();
        selectDefault.classList.add('active');
        // Ensure we are in menu view on mobile
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            body.classList.remove('mobile-project-view');
        }
    }
});