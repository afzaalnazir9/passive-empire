import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress, Button } from '@mui/material';
import { useEmailVerificationWithTokenMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';

function EmailVerification() {
    const location = useLocation();
    const [token, setToken] = useState('');
    const [verifyEmail, { isLoading, isSuccess, isError, error }] = useEmailVerificationWithTokenMutation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        if (token) {
            setToken(token);
        }
    }, [location]);

    useEffect(() => {
        if (token) {
            verifyEmail({ token });
        }
    }, [token, verifyEmail]);

    useEffect(() => {
        if (isSuccess) {
            toast.success('Email Verified Successfully!');
        }
        if (isError) {
            toast.error(error?.data?.message || 'Something went wrong');
        }
    }, [isSuccess, isError, error]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center">
                <div className="text-center p-6 rounded-lg w-96">
                    <CircularProgress color="primary" />
                    <h3 className="text-white text-2xl font-semibold mt-4">
                        Email Verification in Process...
                    </h3>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center">
            <div className="text-center p-6 rounded-lg w-96">
                {isSuccess && (
                    <Button variant="outlined" onClick={() => navigate('/login')} sx={{
                        borderRadius: "50px",
                        padding: "10px 30px",
                        textTransform: "none",
                        color: "white",
                        borderColor: "white",
                        fontSize: "20px",
                        "&:hover": {
                            borderColor: "white",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                    }}>
                        Go to Login
                    </Button>
                )}
            </div>
        </div>
    );
}

export default EmailVerification;
