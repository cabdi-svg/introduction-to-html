// OTP Input Functionality
const otpInputs = document.querySelectorAll('.otp-input');
const verifyBtn = document.querySelector('.verify-btn');
const resendBtn = document.querySelector('.resend-btn');
const countdownElement = document.querySelector('.countdown');
const otpForm = document.querySelector('.otp-form');

let timeLeft = 120; // 2 minutes in seconds
let timerInterval;

// Auto-focus and navigation between inputs
otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        const value = e.target.value;
        
        // Only allow numbers
        if (!/^\d*$/.test(value)) {
            e.target.value = '';
            return;
        }
        
        // Move to next input if current is filled
        if (value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
        
        // Check if all inputs are filled
        checkAllInputsFilled();
    });
    
    input.addEventListener('keydown', (e) => {
        // Move to previous input on backspace if current is empty
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            otpInputs[index - 1].focus();
        }
        
        // Move to next input on arrow right
        if (e.key === 'ArrowRight' && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
        
        // Move to previous input on arrow left
        if (e.key === 'ArrowLeft' && index > 0) {
            otpInputs[index - 1].focus();
        }
    });
    
    // Handle paste event
    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        
        // Only process if pasted data contains only numbers
        if (!/^\d+$/.test(pastedData)) {
            return;
        }
        
        // Fill inputs with pasted data
        const digits = pastedData.split('').slice(0, otpInputs.length);
        digits.forEach((digit, i) => {
            if (otpInputs[i]) {
                otpInputs[i].value = digit;
            }
        });
        
        // Focus on the next empty input or the last one
        const nextEmptyIndex = digits.length < otpInputs.length ? digits.length : otpInputs.length - 1;
        otpInputs[nextEmptyIndex].focus();
        
        checkAllInputsFilled();
    });
});

// Check if all inputs are filled
function checkAllInputsFilled() {
    const allFilled = Array.from(otpInputs).every(input => input.value.length === 1);
    verifyBtn.disabled = !allFilled;
}

// Get OTP value
function getOTPValue() {
    return Array.from(otpInputs).map(input => input.value).join('');
}

// Clear OTP inputs
function clearOTP() {
    otpInputs.forEach(input => {
        input.value = '';
    });
    otpInputs[0].focus();
    verifyBtn.disabled = true;
}

// Countdown timer
function startCountdown() {
    timeLeft = 120;
    resendBtn.disabled = true;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        countdownElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            resendBtn.disabled = false;
            countdownElement.textContent = '00:00';
        }
    }, 1000);
}

// Form submission
otpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const otpValue = getOTPValue();
    console.log('OTP Submitted:', otpValue);
    
    // Simulate verification (replace with actual API call)
    verifyBtn.textContent = 'Verifying...';
    verifyBtn.disabled = true;
    
    setTimeout(() => {
        // Simulate successful verification
        const card = document.querySelector('.verification-card');
        card.classList.add('success');
        
        // Show success message
        let successMsg = document.querySelector('.success-message');
        if (!successMsg) {
            successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.textContent = '✓ Verification successful!';
            otpForm.appendChild(successMsg);
        }
        successMsg.classList.add('show');
        
        verifyBtn.textContent = 'Verified ✓';
        clearInterval(timerInterval);
        
        // Redirect or perform action after successful verification
        setTimeout(() => {
            console.log('Redirecting to dashboard...');
            // window.location.href = '/dashboard';
        }, 1500);
    }, 1500);
});

// Resend code
resendBtn.addEventListener('click', () => {
    console.log('Resending OTP...');
    
    // Simulate resend (replace with actual API call)
    resendBtn.textContent = 'Sending...';
    resendBtn.disabled = true;
    
    setTimeout(() => {
        resendBtn.textContent = 'Resend Code';
        clearOTP();
        startCountdown();
        
        // Show temporary notification
        const notification = document.createElement('div');
        notification.className = 'success-message show';
        notification.textContent = '✓ New code sent!';
        notification.style.marginTop = '12px';
        document.querySelector('.resend-section').appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }, 1000);
});

// Initialize
otpInputs[0].focus();
startCountdown();
verifyBtn.disabled = true;
