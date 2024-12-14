// This is a collection of JS utility functions used in running other JS files

// Pulls the CSRF token and exports it, making it available for other JS files to pull
let csrfToken = '';
let csrfMeta = document.querySelector('meta[name="csrf-token"]');
if (csrfMeta) {
    csrfToken = csrfMeta.content;
    console.log(`running utils.js ... CSRF Token set: ${ csrfToken }`);
} else {
    console.log(`running utils.js ... CSRF meta tag not found.`);
}
export { csrfToken };



//------------------------------------------------------------------------------



// Debounce function takes two arguments: function to be debounced and time (with default in ms)
export function debounce(func, timeout) { // Default timeout set to 300ms
    let timer;
    return function(...args) {
        const context = this; // Capture the current context
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(context, args), timeout);
    };
}



//------------------------------------------------------------------------------



// Submits forms via Ajax, which allows for form submission without page reload
export function handleAjaxFormSubmission(url, formData) {
    return fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        },
    })
    .then(response => {
        return response.json().then(data => {
            if (!response.ok) {
                console.error(`running handleAjaxFormSubmission() ... Server responded with status: ${response.status}`);
                console.error(`running handleAjaxFormSubmission() ... Response text: ${text}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            };
            return data;
        });
    })
    .catch(error => {
        console.error(`running handleAjaxFormSubmission() ... error during AJAX request: ${error}`);
        throw error;
    });
}



//------------------------------------------------------------------------------



// Function to hide the spinner
export function hideSpinner() {
    var spinner = document.getElementById('loadingSpinner');
    var overlay = document.getElementById('overlay');
    if (spinner && overlay) {
        console.log(`running hideSpinner() ... Spinner and overlay element found.`);
        spinner.classList.remove('d-flex'); // Remove the flex display class if it's set
        spinner.classList.add('d-none');    // Add Bootstrap's 'd-none' class to hide the spinner
        overlay.classList.remove('d-flex'); // Remove the flex display class if it's set
        overlay.classList.add('d-none');    // Add Bootstrap's 'd-none' class to hide the overlay
    } else {
        console.log(`running hideSpinner() ... Spinner or overlay element not found.`);
    }
}



//------------------------------------------------------------------------------



// Scroll to the bottom of feedDiv
export function jsScrollDown() {
    // Scroll to the bottom of the page
    window.scrollTo(0, document.body.scrollHeight);
}

export function toPercentage(value) {
    return (value * 100).toFixed(0) + '%';
}

// Format number with commas
export function toNumberWithCommas(number) {
    return Number(number).toLocaleString();
}



//------------------------------------------------------------------------------



// Function to show the spinner
export function showSpinner() {
    var spinner = document.getElementById('loadingSpinner');
    var overlay = document.getElementById('overlay');
    if (spinner && overlay) {
        console.log(`running showSpinner() ... Spinner and overlay element found.`);
        spinner.classList.remove('d-none'); 
        spinner.classList.add('d-flex');
        overlay.classList.remove('d-none');
        overlay.classList.add('d-flex');
    } else {
        console.log(`running showSpinner() ... Spinner or overlay element not found.`);
    }
}


//------------------------------------------------------------------------------


// Attaches eventListeners to the messages in the chat history window so what when a chat is selected, the appropriate number of chat exchanges are highlighted, relative to chat_history_window
export function jsSetHighlightMessageHistoryListeners() {

    const chatHistoryWindowSlider = document.getElementById('chat-history-window');
    let chatHistoryWindowSliderValue = chatHistoryWindowSlider.value*2; // retrieve the initial value

    jsHighlightMessageHistory(chatHistoryWindowSliderValue);
    console.log(`running jsSetHighlightMessageHistoryListeners ... called jsHighlightMessageHistory at page load`)


    if (chatHistoryWindowSlider) {
        chatHistoryWindowSlider.addEventListener('input', (event) => {
            console.log(`running jsSetHighlightMessageHistoryListeners ... called jsHighlightMessageHistory in response to change in slider`)

            chatHistoryWindowSliderValue = chatHistoryWindowSlider.value*2+1; // retrieve the updated value
            jsHighlightMessageHistory(chatHistoryWindowSliderValue); // Call the function again, passing in the upated value

        })

    }
}
    


//------------------------------------------------------------------------------


// Called by jsSetHighlightMessageHistoryListeners to highlight the correct number of chat history exchanges, relative to chat_history_window slider value
function jsHighlightMessageHistory(chatHistoryWindowSliderValue) {
    const feedDiv = document.getElementById('feedDiv')

    if (feedDiv) {
    
        const feedItems = document.getElementsByName('feedItem');
        const feedItemsLength = feedItems.length
        const feedItemsToHighlight = Math.min(feedItemsLength, chatHistoryWindowSliderValue) 

        if (feedItemsLength > 0) {
            // Highlight the last `feedItemsToHighlight` items
            for (let i = feedItemsLength - 1; i >= feedItemsLength - feedItemsToHighlight; i--) {
                feedItems[i].classList.add('bg-secondary'); 
            }

            // Remove highlights from the rest
            for (let x = 0; x < feedItemsLength - feedItemsToHighlight; x++) {
                feedItems[x].classList.remove('bg-secondary'); 
            }
        }
    }
}



//------------------------------------------------------------------------------



// Changes font to #22bd39 (success green)
export function setGreen(elements) {
    if (!Array.isArray(elements)) {
        elements = [elements]; // Wrap the single element in an array
    }
    elements.forEach(element => {
        element.classList.remove('text-taken');
        element.classList.add('text-available');
    });
}




//------------------------------------------------------------------------------



// Changes font to red
export function setRed(elements) {
    if (!Array.isArray(elements)) {
        elements = [elements]; // Wrap the single element in an array
    }
    elements.forEach(element => {
        element.classList.remove('text-available');
        element.classList.add('text-taken');
    });
}




//------------------------------------------------------------------------------



// Collapses accordion 2 after RAG process completes, expands accordion 3
export function transitionAccordionOneToTwo() {
    
    // If DB updated successfully, hide accordion 1, expand accordion 2
    var accordion1Element = document.getElementById('panelsStayOpen-collapseOne')
    var accordion2Element = document.getElementById('panelsStayOpen-collapseTwo')

    if (accordion1Element && accordion2Element) {

        var accordion1 = new bootstrap.Collapse(accordion1Element, { toggle: false });
        var accordion2 = new bootstrap.Collapse(accordion2Element, { toggle: false });

        accordion1.hide(); // Collapse the first accordion
        accordion2.show(); // Show the second accordion
    } else {
        console.log(`running transitionAccordionOneToTwo() ... accordion1 and/or accordion2 not present in the DOM. Unable to run function`)

    }

}



//------------------------------------------------------------------------------



// Update the UserProfile for the value submitted
export function updateProfileForm(fieldName, fieldValue) {

    // Prepare data to send in the request
    const formData = new FormData();

    formData.append('field', fieldName);  // Use the field name from the input
    formData.append('value', fieldValue);  // Use the field value from the input

    const updateProfileViewUrl = '/cs50fp/update_profile/';
    console.log(`running updateUserProfile.js ... updateProfileViewUrl is: ${ updateProfileViewUrl }`);

    handleAjaxFormSubmission(updateProfileViewUrl, formData)
    .then(data => {
        if (data.status === 'success') {
            console.log('running updateUserProfile.js ... profile updated successfully');

        } else {
            console.error(`running updateUserProfile.js ... error submitting form: ${ data.errors}`);
            alert('Failed to update profile');
        }
    })
    .catch(error => {
        console.error(`running setRagSourcesUsed() ... error during form submission: ${ error}`);
        alert('An unexpected error occurred.');
    });
};
