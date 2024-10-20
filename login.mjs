import fetch from 'node-fetch'; // If using Node.js < v18

const url = 'http://172.18.10.10:1000/fgtauth?41f5ed2c803dc6bc';
const maxRetries = 3;
const timeoutDuration = 10000; // 10 seconds
const loginData = {
  magic: '42fb6ec65947111e',
  username: '24BCA7525',
  password: 'FJTe5aWq',
};

async function login() {
    let retries = 0;

    while (retries < maxRetries) {
        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort();
        }, timeoutDuration);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(loginData),
                signal: controller.signal,  // Handle timeout
            });

            clearTimeout(timeout);  // Clear timeout after successful fetch

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            console.log('Login successful');
            break;  // Exit loop on successful login

        } catch (error) {
            retries += 1;
            if (error.name === 'AbortError') {
                console.log(`Attempt ${retries} failed: Request timed out`);
            } else {
                console.log(`Attempt ${retries} failed: ${error.message}`);
            }

            if (retries === maxRetries) {
                console.log('All retries failed.');
            }

        } finally {
            clearTimeout(timeout);  // Ensure timeout is always cleared
        }
    }
}

login();
