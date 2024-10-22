import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';
import { getCardSpacedRMap, saveCardSpacedRMap } from '../storage/localforage';




document.addEventListener('DOMContentLoaded', () => {
    const settingsButton = document.getElementById('settings-button') as HTMLButtonElement | null;
    const settingsWindow = document.getElementById('settings-window') as HTMLElement | null;
    const settingsSaveSpaced = document.getElementById('settings-save-spaced') as HTMLButtonElement | null;
    const settingsDownloadSpaced = document.getElementById('settings-download-spaced') as HTMLButtonElement | null;

    // const closeSettings = document.getElementById('close-settings') as HTMLSpanElement | null;

 

    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            if (settingsWindow) {
                if (settingsWindow.classList.contains('open')) {
                    // Close the settings window
                    settingsWindow.classList.remove('open');
                    settingsWindow.classList.add('hidden');
                } else {
                    // Open the settings window
                    settingsWindow.classList.remove('hidden');
                    settingsWindow.classList.add('open');
                }
            }
        });
    }

    if (settingsSaveSpaced) {
        settingsSaveSpaced.addEventListener('click', saveSpacedCloud);
    }

    if (settingsDownloadSpaced) {
        settingsDownloadSpaced.addEventListener('click', () => {

                    // Show a confirmation alert
        const userConfirmed = window.confirm('Are you sure you want to download the spaced repetition statistics to the cloud?');

        if (userConfirmed) {
            retrieveSpacedRepetition().then(data => {
                saveCardSpacedRMap(data);
                console.log("🚀 ~ settingsDownloadSpaced.addEventListener ~ retrievedSpaceRepData:", data);
            }).catch(error => {
                console.error("Failed to retrieve spaced repetition data:", error);
            });
        } else {
            // User canceled, handle accordingly
            console.log('Download canceled by the user.');
        }


        });
    }
    // Close the settings window when clicking outside of it
    window.addEventListener('click', (event: MouseEvent) => {
        if (settingsWindow && !settingsWindow.contains(event.target as Node) && event.target !== settingsButton) {
            settingsWindow.classList.remove('open');
            settingsWindow.classList.add('hidden');
        }
    });
});


// Function to save spaced repetition statistics to the cloud
function saveSpacedCloud(): void {
    getCardSpacedRMap()
    .then(savedObj => {
        console.log("🚀 ~ savedObj:", savedObj);

        // Show a confirmation alert
        const userConfirmed = window.confirm('Are you sure you want to upload the spaced repetition statistics to the cloud?');

        if (userConfirmed) {
            // User confirmed, proceed with the upload
            uploadToCloud(savedObj);
        } else {
            // User canceled, handle accordingly
            console.log('Upload canceled by the user.');
        }
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });

    console.log('Saving spaced repetition statistics to the cloud...');
}





// Create a reference to 'spacedRepetition/spacedRepetition.json'
const fileRef = ref(storage, 'spacedRepetition/spacedRepetition.json');

// Upload spacedRepetition object
const uploadToCloud = async (spacedRepetition: object) => {
  try {
    // Convert the object to a JSON string and then to a Blob
    const blob = new Blob([JSON.stringify(spacedRepetition)], { type: 'application/json' });
    
    // Upload the Blob
    const snapshot = await uploadBytes(fileRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('File available at', downloadURL);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};





// Retrieve the spacedRepetition object
const retrieveSpacedRepetition = async () => {
  try {
    // Get the download URL for the file
    const url = await getDownloadURL(fileRef);
    
    // Fetch the file using the download URL
    const response = await fetch(url);
    
    // Convert the response to JSON
    const json = await response.json();

    return json;
  } catch (error) {
    console.error('Retrieval failed:', error);
  }
};

