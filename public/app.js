document.getElementById('greetingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('generateBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const resultArea = document.getElementById('resultArea');
    
    // Show loading state on button
    btn.disabled = true;
    btn.classList.add('btn-loading');
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    
    try {
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('generatedMessage').textContent = result.message;
            document.getElementById('disclaimer').textContent = result.disclaimer;
            
            // Show mystery tone reveal if it was used
            if (result.mysteryTone) {
                const mysteryReveal = document.createElement('p');
                mysteryReveal.className = 'text-xs dynamic-text-muted italic mt-2';
                mysteryReveal.textContent = `🎭 Mystery style revealed: ${result.mysteryTone}`;
                document.getElementById('disclaimer').appendChild(mysteryReveal);
            }
            
            resultArea.classList.remove('hidden');
            resultArea.scrollIntoView({ behavior: 'smooth' });
        } else {
            alert(result.error || 'Something went wrong. Please try again.');
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Network error. Please check your connection and try again.');
    } finally {
        // Reset button state
        btn.disabled = false;
        btn.classList.remove('btn-loading');
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
    }
});

function copyMessage() {
    const message = document.getElementById('generatedMessage').textContent;
    navigator.clipboard.writeText(message).then(() => {
        // Temporarily change button text
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        btn.classList.add('bg-green-500', 'hover:bg-green-600');
        btn.classList.remove('bg-gray-500', 'hover:bg-gray-600');
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('bg-green-500', 'hover:bg-green-600');
            btn.classList.add('bg-gray-500', 'hover:bg-gray-600');
        }, 2000);
    }).catch(() => {
        alert('Failed to copy message to clipboard.');
    });
}

function generateAnother() {
    document.getElementById('resultArea').classList.add('hidden');
    document.querySelector('h1').scrollIntoView({ behavior: 'smooth' });
}