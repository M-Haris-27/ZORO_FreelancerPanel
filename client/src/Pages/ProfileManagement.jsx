import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Grid,
    Avatar,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import { Edit, Delete, Add, Close } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProfileManagement = () => {
    const { user } = useSelector((state) => state.user);
    const [profile, setProfile] = useState({
        bio: '',
        skills: [],
        portfolio: [],
        avatar: ''
    });
    const [newSkill, setNewSkill] = useState('');
    const [newPortfolioLink, setNewPortfolioLink] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/v1/profiles/', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                // Adjust to match the nested structure
                const profileData = data.profile || {}; // Adjust this if the structure differs
                setProfile({
                    bio: profileData.bio || '',
                    skills: profileData.skills || [],
                    portfolio: profileData.portfolio || [],
                    avatar: profileData.avatar || '',
                });
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to fetch profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('An error occurred while fetching the profile');
        }
    };


    useEffect(() => {
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSkill = () => {
        if (newSkill && !profile.skills.includes(newSkill)) {
            setProfile((prev) => ({
                ...prev,
                skills: [...prev.skills, newSkill]
            }));
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setProfile((prev) => ({
            ...prev,
            skills: prev.skills.filter((skill) => skill !== skillToRemove)
        }));
    };

    const handleAddPortfolioLink = () => {
        if (newPortfolioLink && !profile.portfolio.includes(newPortfolioLink)) {
            setProfile((prev) => ({
                ...prev,
                portfolio: [...prev.portfolio, newPortfolioLink]
            }));
            setNewPortfolioLink('');
        }
    };

    const handleRemovePortfolioLink = (linkToRemove) => {
        setProfile((prev) => ({
            ...prev,
            portfolio: prev.portfolio.filter((link) => link !== linkToRemove)
        }));
    };

    const handleUpdateProfile = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/v1/profiles/', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bio: profile.bio,
                    skills: profile.skills,
                    portfolio: profile.portfolio,
                    avatar: profile.avatar
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Profile updated successfully!');
                setIsEditing(false);
            } else {
                toast.error(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            toast.error('An error occurred while updating profile');
        }
    };

    const handleDeleteProfile = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/v1/profiles/', {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Profile deletion request submitted');
                setOpenDeleteDialog(false);
            } else {
                toast.error(data.message || 'Failed to submit profile deletion request');
            }
        } catch (error) {
            console.error('Delete profile error:', error);
            toast.error('An error occurred while submitting profile deletion request');
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} textAlign="center">
                        <Avatar
                            src={profile.avatar}
                            sx={{ width: 100, height: 100, margin: 'auto', mb: 2 }}
                        />
                        <Typography variant="h4">
                            {user?.firstName} {user?.lastName}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {user?.email}
                        </Typography>
                    </Grid>

                    {!isEditing ? (
                        <>
                            <Grid item xs={12}>
                                <Typography variant="h6">Bio</Typography>
                                <Typography>{profile.bio || 'No bio provided'}</Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6">Skills</Typography>
                                <Grid container spacing={1}>
                                    {profile.skills.map((skill) => (
                                        <Grid item key={skill}>
                                            <Typography>{skill}</Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6">Portfolio</Typography>
                                {profile.portfolio.map((link) => (
                                    <Typography
                                        key={link}
                                        component="a"
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {link}
                                    </Typography>
                                ))}
                            </Grid>
                        </>
                    ) : (
                        <>
                            {/* Editing Form */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Bio"
                                    name="bio"
                                    multiline
                                    rows={4}
                                    value={profile.bio}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6">Skills</Typography>
                                <Grid container spacing={2} alignItems="center">
                                    {profile.skills.map((skill) => (
                                        <Grid item key={skill}>
                                            <Button
                                                variant="outlined"
                                                endIcon={<Close />}
                                                onClick={() => handleRemoveSkill(skill)}
                                            >
                                                {skill}
                                            </Button>
                                        </Grid>
                                    ))}
                                    <Grid item xs={12}>
                                        <TextField
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            label="Add Skill"
                                            variant="outlined"
                                        />
                                        <IconButton onClick={handleAddSkill}>
                                            <Add />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6">Portfolio Links</Typography>
                                {profile.portfolio.map((link) => (
                                    <Grid container key={link} alignItems="center" spacing={2}>
                                        <Grid item xs={10}>
                                            <TextField
                                                fullWidth
                                                value={link}
                                                variant="outlined"
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <IconButton onClick={() => handleRemovePortfolioLink(link)}>
                                                <Delete />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={10}>
                                        <TextField
                                            fullWidth
                                            value={newPortfolioLink}
                                            onChange={(e) => setNewPortfolioLink(e.target.value)}
                                            label="Add Portfolio Link"
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton onClick={handleAddPortfolioLink}>
                                            <Add />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    )}

                    <Grid item xs={12} container spacing={2}>
                        {!isEditing ? (
                            <>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Edit />}
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<Delete />}
                                        onClick={() => setOpenDeleteDialog(true)}
                                    >
                                        Delete Profile
                                    </Button>
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleUpdateProfile}
                                    >
                                        Save Changes
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>Delete Profile</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your profile?
                        This action is subject to admin approval and cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteProfile}
                        color="error"
                        autoFocus
                    >
                        Confirm Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProfileManagement;
