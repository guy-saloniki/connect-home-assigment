// Query selectors
const addNotificationBtn = document.querySelector('.add-alert-icon');
const closeModalBtn = document.querySelector('.close-btn');
const modalContainer = document.querySelector('.modal-container');
const modal = document.querySelector('.modal');
const saveNotificationBtn = document.querySelector('.save-alert-btn');
const mainContainer = document.querySelector('.container');
const notificationsContainer = document.querySelector(
  '.notifications-container'
);
const notificationItemsContainer = document.querySelector(
  '.notification-items-container'
);
const notificationBtn = document.querySelector('.notification-btn');
const closeNotificationsBtn = document.querySelector(
  '.notifications-close-btn'
);
const notificationSpan = document.querySelector('.notification-span');
const allNotificationsTab = document.querySelector('.all-notifications-tab');
const unreadNotificationsTab = document.querySelector(
  '.unread-notifications-tab'
);
const isReadLabel = document.querySelector('.isRead');
const markAllReadBtn = document.querySelector('.mark-all-read-btn');
const markAllReadContainer = document.querySelector('.mark-all-read-container');
const noMoreNotificationsContainer = document.querySelector(
  '.no-more-notifications-container'
);
const loadMoreBtn = document.querySelector('.load-more');
const notificatiionBtnMobile = document.querySelector(
  '.notification-btn-mobile'
);
const notificationSpanMobile = document.querySelector(
  '.notification-span-mobile'
);
const mobileNav = document.querySelector('.mobile-nav');
const forYourAttentionMobile = document.querySelector('.for-your-attention');
const letterCountSpan = document.querySelector('.letter-count-span');
const textarea = document.querySelector('textarea');

// Add notification to notifications list
const addNotification = (e) => {
  e.preventDefault();

  const title = document.querySelector('.alert-title').value;
  const content = document.querySelector('.textarea').value;

  if (title === '' || content === '') {
    alert('חובה למלא כותרת ותוכן התראה');
    return;
  }

  // Load notifications from local storage
  const notifications = getNotifications();

  const id = notifications.length + 1;

  const date = formattedDate();

  const newNotification = {
    id,
    title,
    content,
    date,
    read: false,
  };

  const updatedNotifications = [newNotification, ...notifications];
  localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

  modal.classList.add('show-success');
  noMoreNotificationsContainer.style.display = 'none';
  markAllReadContainer.style.display = 'block';

  showNumOfNotifications();
  showNumNotificationsMobile();
};

// Load unread notifications tab
const loadUnreadNotifications = () => {
  allNotificationsTab.classList.remove('current');
  unreadNotificationsTab.classList.add('current');

  notificationItemsContainer.innerHTML = '';

  const unReadNotifications = getNotifications().filter(
    (not) => not.read === false
  );

  if (unReadNotifications.length === 0) {
    markAllReadContainer.style.display = 'none';
    noMoreNotificationsContainer.style.display = 'block';
  } else {
    markAllReadContainer.style.display = 'block';
    markAllReadBtn.style.display = 'block';
    noMoreNotificationsContainer.style.display = 'none';
    if (unReadNotifications.length > 4) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
    }
  }

  unReadNotifications.forEach((notification) => {
    const div = document.createElement('div');
    const backgroundColor = !notification.read ? '#0D7DFF' : '#959595';
    div.classList.add('notification-item');
    div.innerHTML = `
    <div class="item-header">
              <span class="isRead" style="background-color: ${backgroundColor}" onclick="
        updateNotificationToRead(${notification.id})"></span>
              <h4>${notification.title}</h4>
            </div>
            <p class="item-content">
             ${notification.content}
            </p>
            <div class="item-time">
              <p>${notification.date.split(' ')[0]} | ${
      notification.date.split(' ')[1]
    }</p>
            </div>
    `;
    notificationItemsContainer.appendChild(div);
  });
};

// Load read notifications tab
const loadReadNotifications = () => {
  unreadNotificationsTab.classList.remove('current');
  allNotificationsTab.classList.add('current');

  notificationItemsContainer.innerHTML = '';
  markAllReadBtn.style.display = 'none';
  noMoreNotificationsContainer.style.display = 'none';
  loadMoreBtn.style.display = 'block';

  const readNotifications = getNotifications().filter(
    (not) => not.read === true
  );

  if (readNotifications.length === 0) {
    markAllReadContainer.style.display = 'none';
    noMoreNotificationsContainer.style.display = 'block';
  } else {
    markAllReadContainer.style.display = 'block';
    noMoreNotificationsContainer.style.display = 'none';
  }

  const sorted = sortNotificationsByDate(readNotifications);

  sorted.forEach((notification) => {
    const div = document.createElement('div');
    const backgroundColor = !notification.read ? '#0D7DFF' : '#959595';
    div.classList.add('notification-item');
    div.innerHTML = `
    <div class="item-header">
              <span class="isRead" style="background-color: ${backgroundColor}" ></span>
              <h4>${notification.title}</h4>
            </div>
            <p class="item-content">
             ${notification.content}
            </p>
            <div class="item-time">
              <p>${notification.date.split(' ')[0]} | ${
      notification.date.split(' ')[1]
    }</p>
            </div>
    `;
    notificationItemsContainer.appendChild(div);
  });
};

// Update notification to read
const updateNotificationToRead = (id) => {
  const notification = getNotifications().find((not) => not.id === id);
  const updatedNotification = {
    ...notification,
    read: true,
  };

  // remove old notification from list
  const filteredNotifications = getNotifications().filter(
    (not) => not.id !== id
  );

  const updatedNotifications = [updatedNotification, ...filteredNotifications];
  localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

  loadUnreadNotifications();
  showNumOfNotifications();
  showNumNotificationsMobile();
};

// Load more notifications
const loadMore = () => {
  let currentItem = 3;

  const notificationItems = document.querySelectorAll('.notification-item');

  if (notificationItems.length >= 4) {
    for (let i = currentItem; i < notificationItems.length; i++) {
      notificationItems[i].style.display = 'flex';
    }

    loadMoreBtn.style.display = 'none';
    markAllReadContainer.style.display = 'block';
  }
};

loadMoreBtn.addEventListener('click', loadMore);

// Mark all notifiactions as read
const markAllNotificationsRead = () => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map((not) => ({
    ...not,
    read: true,
  }));

  localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

  loadReadNotifications();
  loadUnreadNotifications();
  showNumOfNotifications();
  showNumNotificationsMobile();
};

// Click event to mark all notifications as read
markAllReadBtn.addEventListener('click', markAllNotificationsRead);

// Add click enents to load tabs
unreadNotificationsTab.addEventListener('click', loadUnreadNotifications);
allNotificationsTab.addEventListener('click', loadReadNotifications);

// show modal
addNotificationBtn.addEventListener('click', () => {
  modalContainer.classList.add('show-modal');
});

// Hide modal
closeModalBtn.addEventListener('click', () => {
  modalContainer.classList.remove('show-modal');

  // remove 'show-success' class from modal
  modal.classList.remove('show-success');

  // Clear fields
  document.querySelector('.alert-title').value = '';
  document.querySelector('.textarea').value = '';
});

// Save notification
saveNotificationBtn.addEventListener('click', addNotification);

// Open notifications area
notificationBtn.addEventListener('click', () => {
  notificationItemsContainer.innerHTML = '';
  mainContainer.style.display = 'none';
  notificationsContainer.style.display = 'block';

  loadUnreadNotifications();
});

// Count letters in textarea
const countLetters = () => {
  const content = textarea.value.trim();
  const lettersLength = content.length;
  if (lettersLength > 100) {
    alert('הגעת למקסימום תווים');
    return;
  } else {
    letterCountSpan.innerText = lettersLength;
  }
};

textarea.addEventListener('input', countLetters);

notificatiionBtnMobile.addEventListener('click', () => {
  notificationItemsContainer.innerHTML = '';
  mainContainer.style.display = 'none';
  notificationsContainer.style.display = 'block';

  loadUnreadNotifications();
});

// Close notifications area
closeNotificationsBtn.addEventListener('click', () => {
  notificationsContainer.style.display = 'none';
  mainContainer.style.display = 'block';
});

// Sort notifications by date
const sortNotificationsByDate = (notifications) => {
  const sorted = notifications.sort((a, b) => {
    const dateA = new Date(
      a.date.replace(
        /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/,
        '$3-$2-$1T$4:$5'
      )
    );
    const dateB = new Date(
      b.date.replace(
        /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/,
        '$3-$2-$1T$4:$5'
      )
    );
    return dateB - dateA;
  });
  return sorted;
};

// Get current date formatted
const formattedDate = () => {
  const currentDate = new Date();

  // Extract date components
  const day = String(currentDate.getDate()).padStart(2, '0'); // Add leading zero if needed
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
  const year = currentDate.getFullYear();

  // Extract time components
  const hours = String(currentDate.getHours()).padStart(2, '0'); // Add leading zero if needed
  const minutes = String(currentDate.getMinutes()).padStart(2, '0'); // Add leading zero if needed
  // Format the date and time
  const date = `${day}/${month}/${year} ${hours}:${minutes}`;
  return date;
};

// Add notifications to local storage
const addNotificationsToLocalStorage = async () => {
  // Check if notifications are already present in local storage
  const existingNotifications = localStorage.getItem('notifications');

  if (!existingNotifications) {
    // Load json data
    const res = await fetch('./notifications.json');
    const { data } = await res.json();

    // Save notifications in local storage
    const notifications = data[0].notifications;

    const sortedNotifications = sortNotificationsByDate(notifications);

    localStorage.setItem('notifications', JSON.stringify(sortedNotifications));
  }
};

// Get list of notifications from local storage
const getNotifications = () => {
  const notifications = JSON.parse(localStorage.getItem('notifications'));
  return notifications;
};

// Show number of notifications on the red label
const showNumOfNotifications = () => {
  const notifications = getNotifications();

  const unReadNotifications =
    notifications.length > 0 &&
    notifications.filter((not) => not.read === false);

  if (unReadNotifications.length > 0) {
    notificationSpan.style.display = 'flex';
    notificationSpanMobile.style.display = 'flex';
    notificationSpan.innerText = unReadNotifications.length;
  } else {
    notificationSpan.style.display = 'none';
  }
};

const showNumNotificationsMobile = () => {
  const notifications = getNotifications();

  const unReadNotifications =
    notifications.length > 0 &&
    notifications.filter((not) => not.read === false);

  if (unReadNotifications.length > 0) {
    notificationSpanMobile.style.display = 'flex';
    notificationSpanMobile.innerText = unReadNotifications.length;
  } else {
    notificationSpanMobile.style.display = 'none';
  }
};

addNotificationsToLocalStorage();
showNumOfNotifications();
showNumNotificationsMobile();
