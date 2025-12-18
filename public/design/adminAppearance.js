const adminThemeBtns = document.querySelectorAll('.admin-appearance-section-1 > div > form > button');

adminThemeBtns.forEach((button) => {
    console.log(button); // Testing 
    button.addEventListener('click', async(e) => {
        e.preventDefault();
        
        const theme = e.target.dataset.theme; 

        await fetch("/admin/dashboard/appearance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ theme }),
        });

        window.location.reload();
    });
}); 


