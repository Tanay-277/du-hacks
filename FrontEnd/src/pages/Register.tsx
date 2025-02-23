import React from 'react';
import { signUp } from '../../utils/authUtil';
import { supaBaseClient } from '../../utils/supaBaseClient';

const Register: React.FC = () => {
    // State management for form inputs.
    const [emailState, setEmailState] = React.useState("");
    const [passWordState, setPassWordState] = React.useState("");
    const [userType, setUserType] = React.useState<'vendor' | 'consumer'>('consumer'); // Default to 'consumer'

    // Handle sign-up functionality.
    async function handleSignUp() {
        if (!emailState || !passWordState) {
            return alert("Please fill all fields");
        }

        // Sign up the user via Supabase Auth
        const { user, error } = await signUp(emailState.trim(), passWordState.trim(), userType);

        if (error) {
            return alert("Error signing up: " + error.message);
        }

        if (user) {
            // Insert user into the correct table based on type
            const { error: insertError } = await supaBaseClient
                .from(userType) // Insert into "vendor" or "consumer" table dynamically
                .insert([{ 
                    id: user.id, 
                    email: emailState.trim() 
                }]);

            if (insertError) {
                alert("Error adding user to table: " + insertError.message);
            } else {
                alert("Registration successful!");
                setEmailState("");
                setPassWordState("");
                setUserType("consumer");
            }
        }
    }

    return (
        <>
            <h2>Register</h2>

            Email:
            <input
                type="text"
                value={emailState}
                onChange={(event) => setEmailState(event.target.value)}
            />

            Password:
            <input
                type="password"
                value={passWordState}
                onChange={(event) => setPassWordState(event.target.value)}
            />

            <div>
                <label>
                    <input
                        type="radio"
                        value="vendor"
                        checked={userType === "vendor"}
                        onChange={() => setUserType("vendor")}
                    />
                    Vendor
                </label>

                <label>
                    <input
                        type="radio"
                        value="consumer"
                        checked={userType === "consumer"}
                        onChange={() => setUserType("consumer")}
                    />
                    Consumer
                </label>
            </div>

            <button onClick={handleSignUp}>Sign Up</button>
        </>
    );
};

export default Register;
