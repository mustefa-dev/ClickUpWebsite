self.addEventListener('push', function(event) {
    let data = {};

    // Check if the data is in JSON format
    try {
        data = event.data.json();
    } catch (e) {
        console.error('Failed to parse push message data as JSON:', e);
        // If JSON parsing fails, use the raw text data
        data = {
            title: 'Notification',
            body: event.data.text() || 'No content',
            icon: 'default-icon.png',
            data: {
                url: '/'
            }
        };
    }

    // Ensure the data object has the necessary properties
    const options = {
        body: data.body || 'Default body text',
        icon: data.icon || 'default-icon.png',
        data: {
            url: data.data && data.data.url ? data.data.url : '/'
        }
    };

    // Show the notification
    event.waitUntil(
        self.registration.showNotification(data.title || 'Default Title', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});
