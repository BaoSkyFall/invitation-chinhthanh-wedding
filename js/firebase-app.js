
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBWuVsPUGubl6oN3Yd6ktIOHXcAlxcepMQ",
    authDomain: "wishing-wedding-bao-thanh.firebaseapp.com",
    projectId: "wishing-wedding-bao-thanh",
    storageBucket: "wishing-wedding-bao-thanh.appspot.com",
    messagingSenderId: "963145263560",
    appId: "1:963145263560:web:ce0ca128831fb44329f8fd",
    measurementId: "G-TRYGKX2LBM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
$(document).ready(function () {
    $('#wishingForm').on('submit', async function (e) {
        e.preventDefault();

        let isValid = true;
        const nameField = $('input[name="nameWishing"]');
        const messageWishingField = $('textarea[name="messageWishing"]');
        const suggestionField = $('select[name="suggestion"]');
        if (!messageWishingField.val() && !suggestionField.val()) {
            messageWishingField.next('.error-message').show();
            messageWishingField.addClass('mb-0');
            isValid = false;
        }
        else {
            messageWishingField.next('.error-message').hide();
            messageWishingField.removeClass('mb-0');


        }
        if (nameField.val().trim() === '') {
            nameField.next('.error-message').show();
            isValid = false;
        } else {
            nameField.next('.error-message').hide();
        }
        if (isValid) {
            const formData = $(this).serializeArray();
            const formObject = {};
            $.each(formData, function (_, field) {
                formObject[field.name] = field.value;
            });
            if (!formObject.messageWishing) {
                formObject.messageWishing = formObject.suggestion;
            }
            formObject.timestamp = new Date();
            try {
                await signInAnonymously(auth);
                await addDoc(collection(db, 'rsvp_entries'), formObject);
                $('.contact__msg_wishing').show();
                $('#wishingForm')[0].reset();
                loadData();
            } catch (error) {
                console.error('Error handling the form submission', error);
            }
        }
    });

    async function loadData() {
        try {
            const q = query(collection(db, 'rsvp_entries'), orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            let delay = 3000; // Initial delay
            querySnapshot.forEach(async (doc) => {
                const data = doc.data();
                console.log('data:', data)
                setTimeout(() => {
                    Toastify({
                        text: `Lời chúc từ ${data.nameWishing} (${data.relationship}): ${data.messageWishing}`,
                        duration: 7500,
                        newWindow: true,
                        gravity: "top", // `top` or `bottom`
                        position: "center", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "linear-gradient(to right, #BD945A, #D2B27A)",
                        },
                        onClick: function () { } // Callback after click
                    }).showToast();
                }, delay);
                delay += 8000;
            });
        } catch (error) {
            console.error('Error loading data', error);
        }
    }

    // Initial data load
    signInAnonymously(auth).then(() => {
        loadData();
    }).catch(error => {
        console.error('Authentication failed', error);
    });
});

