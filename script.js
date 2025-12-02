// Moving Business App - Main JavaScript
class MovingBusinessApp {
    constructor() {
        this.bookings = JSON.parse(localStorage.getItem('movingBookings')) || [];
        this.reviews = JSON.parse(localStorage.getItem('movingReviews')) || [];
        this.currentJob = null;
        this.startTime = null;
        this.timerInterval = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadSampleData();
        this.updatePrice();
        this.updateAdminDashboard();
        this.startLiveTracking();
    }
    
    setupEventListeners() {
        // Size selection
        document.querySelectorAll('.size-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectSizeOption(e.currentTarget);
            });
        });
        
        // Service checkboxes
        document.querySelectorAll('.service-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updatePrice();
            });
        });
        
        // Submit booking
        document.getElementById('submitBooking').addEventListener('click', (e) => {
            e.preventDefault();
            this.submitBooking();
        });
        
        // Star rating
        document.querySelectorAll('.star-rating i').forEach(star => {
            star.addEventListener('click', (e) => {
                this.setRating(parseInt(e.target.dataset.rating));
            });
        });
        
        // Submit review
        document.querySelector('.submit-review-btn').addEventListener('click', () => {
            this.submitReview();
        });
        
        // Admin controls
        document.getElementById('addJobBtn').addEventListener('click', () => {
            this.addManualJob();
        });
        
        // Date defaults
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('moveDate').min = tomorrow.toISOString().split('T')[0];
        document.getElementById('moveDate').value = tomorrow.toISOString().split('T')[0];
    }
    
    selectSizeOption(option) {
        // Remove active class from all options
        document.querySelectorAll('.size-option').forEach(opt => {
            opt.classList.remove('active');
        });
        
        // Add active class to selected option
        option.classList.add('active');
        
        // Update hidden inputs
        const size = option.dataset.size;
        const price = option.dataset.price;
        
        document.getElementById('propertySize').value = size;
        document.getElementById('basePrice').value = price;
        
        // Update price display
        this.updatePrice();
    }
    
    updatePrice() {
        // Get base price
        const basePrice = parseFloat(document.getElementById('basePrice').value) || 0;
        
        // Calculate additional services
        let servicesPrice = 0;
        document.querySelectorAll('.service-checkbox:checked').forEach(checkbox => {
            servicesPrice += parseFloat(checkbox.dataset.price);
        });
        
        // Calculate distance surcharge (simulated)
        const distancePrice = Math.random() * 100;
        
        // Calculate total
        const totalPrice = basePrice + servicesPrice + distancePrice;
        
        // Update displays
        document.getElementById('basePriceDisplay').textContent = `$${basePrice.toFixed(2)}`;
        document.getElementById('servicesPrice').textContent = `$${servicesPrice.toFixed(2)}`;
        document.getElementById('distancePrice').textContent = `$${distancePrice.toFixed(2)}`;
        document.getElementById('totalPrice').textContent = `$${totalPrice.toFixed(2)}`;
        document.getElementById('finalPrice').textContent = totalPrice.toFixed(0);
    }
    
    submitBooking() {
        // Get form values
        const booking = {
            id: Date.now().toString(),
            customerName: document.getElementById('customerName').value,
            phone: document.getElementById('phone').value,
            moveDate: document.getElementById('moveDate').value,
            moveTime: document.getElementById('moveTime').value,
            pickupStreet: document.getElementById('pickupStreet').value,
            pickupCity: document.getElementById('pickupCity').value,
            deliveryStreet: document.getElementById('deliveryStreet').value,
            deliveryCity: document.getElementById('deliveryCity').value,
            propertySize: document.getElementById('propertySize').value,
            basePrice: document.getElementById('basePrice').value,
            additionalServices: [],
            instructions: document.getElementById('instructions').value,
            totalPrice: parseFloat(document.getElementById('totalPrice').textContent.replace('$', '')),
            status: 'booked',
            createdAt: new Date().toISOString()
        };
        
        // Get selected services
        document.querySelectorAll('.service-checkbox:checked').forEach(checkbox => {
            booking.additionalServices.push({
                name: checkbox.value,
                price: checkbox.dataset.price
            });
        });
        
        // Validate required fields
        if (!booking.customerName || !booking.phone || !booking.pickupStreet || !booking.deliveryStreet) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Add to bookings
        this.bookings.push(booking);
        this.saveBookings();
        
        // Show confirmation
        alert(`Booking confirmed!\n\nCustomer: ${booking.customerName}\nDate: ${booking.moveDate}\nTotal: $${booking.totalPrice}\n\nA confirmation will be sent to ${booking.phone}`);
        
        // Reset form
        document.getElementById('customerName').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('pickupStreet').value = '';
        document.getElementById('pickupCity').value = '';
        document.getElementById('deliveryStreet').value = '';
        document.getElementById('deliveryCity').value = '';
        document.getElementById('instructions').value = '';
        
        // Reset checkboxes
        document.querySelectorAll('.service-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Update admin dashboard
        this.updateAdminDashboard();
    }
    
    submitReview() {
        const name = document.getElementById('reviewName').value;
        const rating = document.querySelectorAll('.star-rating i.active').length;
        const text = document.getElementById('reviewText').value;
        
        if (!name || !rating || !text) {
            alert('Please fill in all review fields');
            return;
        }
        
        const review = {
            id: Date.now().toString(),
            name: name,
            rating: rating,
            text: text,
            date: new Date().toLocaleDateString()
        };
        
        this.reviews.push(review);
        localStorage.setItem('movingReviews', JSON.stringify(this.reviews));
        
        // Show review in list
        this.addReviewToDOM(review);
        
        // Reset form
        document.getElementById('reviewName').value = '';
        document.getElementById('reviewText').value = '';
        document.querySelectorAll('.star-rating i').forEach(star => {
            star.classList.remove('active');
        });
        
        alert('Thank you for your review!');
    }
    
    setRating(rating) {
        const stars = document.querySelectorAll('.star-rating i');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
    
    startLiveTracking() {
        // Simulate live updates
        this.timerInterval = setInterval(() => {
            this.updateLiveMetrics();
        }, 5000);
        
        // Start tracking for demo
        this.currentJob = {
            startTime: new Date(),
            distance: 25,
            baseCost: 499
        };
        this.startTime = this.currentJob.startTime;
    }
    
    updateLiveMetrics() {
        if (!this.currentJob) return;
        
        // Calculate elapsed time
        const now = new Date();
        const elapsed = now - this.startTime;
        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        
        // Update distance (simulate movement)
        const progress = Math.min(elapsed / (1000 * 60 * 60 * 2), 1); // 2 hour total trip
        const currentDistance = Math.floor(25 * progress);
        
        // Calculate live cost (base + time-based)
        const timeCost = (hours + minutes/60) * 75; // $75 per hour
        const liveCost = this.currentJob.baseCost + timeCost;
        
        // Update DOM
        document.getElementById('liveTime').textContent = `${hours}h ${minutes}m`;
        document.getElementById('liveDistance').textContent = `${currentDistance} miles`;
        document.getElementById('liveCost').textContent = `$${liveCost.toFixed(2)}`;
        
        // Update progress bar
        this.updateProgressBar(progress);
    }
    
    updateProgressBar(progress) {
        const steps = document.querySelectorAll('.status-step');
        const activeStep = Math.floor(progress * steps.length);
        
        steps.forEach((step, index) => {
            if (index <= activeStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    updateAdminDashboard() {
        // Update stats
        const today = new Date().toISOString().split('T')[0];
        const todaysJobs = this.bookings.filter(b => b.moveDate === today).length;
        const todaysRevenue = this.bookings
            .filter(b => b.moveDate === today)
            .reduce((sum, b) => sum + b.totalPrice, 0);
        
        document.getElementById('todayJobs').textContent = todaysJobs;
        document.getElementById('todayRevenue').textContent = `$${todaysRevenue.toFixed(0)}`;
        document.getElementById('activeCustomers').textContent = this.bookings.length;
        
        // Update jobs table
        this.updateJobsTable();
    }
    
    updateJobsTable() {
        const tableBody = document.getElementById('jobsList');
        tableBody.innerHTML = '';
        
        // Show last 5 bookings
        const recentBookings = this.bookings.slice(-5).reverse();
        
        recentBookings.forEach(booking => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${booking.customerName}</td>
                <td>${booking.moveDate}</td>
                <td>${booking.pickupCity} → ${booking.deliveryCity}</td>
                <td>${this.getSizeLabel(booking.propertySize)}</td>
                <td><span class="status-badge ${booking.status}">${booking.status}</span></td>
                <td>$${booking.totalPrice}</td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    getSizeLabel(size) {
        const sizes = {
            'small': 'Furniture',
            '1bed': '1 Bedroom',
            '2bed': '2 Bedrooms',
            '3bed': '3+ Bedrooms'
        };
        return sizes[size] || size;
    }
    
    addManualJob() {
        const job = {
            id: Date.now().toString(),
            customerName: 'Manual Entry',
            phone: '(555) 000-0000',
            moveDate: new Date().toISOString().split('T')[0],
            propertySize: '1bed',
            totalPrice: 499,
            status: 'booked',
            createdAt: new Date().toISOString()
        };
        
        this.bookings.push(job);
        this.saveBookings();
        this.updateAdminDashboard();
        
        alert('Manual job added successfully!');
    }
    
    addReviewToDOM(review) {
        const reviewsList = document.querySelector('.reviews-list');
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        
        // Create stars HTML
        let starsHTML = '';
        for (let i = 0; i < 5; i++) {
            starsHTML += i < review.rating ? 
                '<i class="fas fa-star"></i>' : 
                '<i class="far fa-star"></i>';
        }
        
        reviewCard.innerHTML = `
            <div class="review-header">
                <div class="reviewer">${review.name}</div>
                <div class="review-stars">${starsHTML}</div>
            </div>
            <p>"${review.text}"</p>
            <div class="review-date">${review.date}</div>
        `;
        
        // Add to top of list
        reviewsList.insertBefore(reviewCard, reviewsList.firstChild);
    }
    
    loadSampleData() {
        // Load sample reviews
        if (this.reviews.length === 0) {
            this.reviews = [
                {
                    id: '1',
                    name: 'Sarah Johnson',
                    rating: 5,
                    text: 'Excellent service! The team was professional and careful with all my furniture. Real-time tracking was amazing!',
                    date: 'March 15, 2024'
                },
                {
                    id: '2',
                    name: 'Mike Chen',
                    rating: 4,
                    text: 'Very efficient move. The app made scheduling easy and the price was exactly as quoted. Will use again!',
                    date: 'March 10, 2024'
                }
            ];
            localStorage.setItem('movingReviews', JSON.stringify(this.reviews));
        }
        
        // Load sample bookings if empty
        if (this.bookings.length === 0) {
            this.bookings = [
                {
                    id: '1',
                    customerName: 'John Smith',
                    phone: '(555) 123-4567',
                    moveDate: new Date().toISOString().split('T')[0],
                    pickupCity: 'New York',
                    deliveryCity: 'Boston',
                    propertySize: '2bed',
                    totalPrice: 799,
                    status: 'in transit',
                    createdAt: new Date().toISOString()
                }
            ];
            this.saveBookings();
        }
        
        // Display sample reviews
        this.reviews.forEach(review => this.addReviewToDOM(review));
    }
    
    saveBookings() {
        localStorage.setItem('movingBookings', JSON.stringify(this.bookings));
    }
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.movingApp = new MovingBusinessApp();
});

// Add some CSS for status badges
const style = document.createElement('style');
style.textContent = `
    .status-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: bold;
    }
    .status-badge.booked {
        background: #3498db;
        color: white;
    }
    .status-badge.loading {
        background: #f39c12;
        color: white;
    }
    .status-badge.in\ transit {
        background: #9b59b6;
        color: white;
    }
    .status-badge.unloading {
        background: #e74c3c;
        color: white;
    }
    .status-badge.completed {
        background: #2ecc71;
        color: white;
    }
`;
document.head.appendChild(style);