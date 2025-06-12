import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {Logout , Settings , PersonAdd , PersonPin}  from '@mui/icons-material';

export default function AccountMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    type menuOptin = {
        label?: string,
        icon?: React.ReactNode,
        divider?: boolean
    }

    const menuOptions: menuOptin[] = [
        { label: "Profile", icon: <Avatar /> },
        { label: "My account", icon: <Avatar /> },
        { divider: true },
        { label: "Add another account", icon: <ListItemIcon><PersonAdd fontSize="small" /></ListItemIcon> },
        { label: "Settings", icon: <ListItemIcon><Settings fontSize="small" /></ListItemIcon> },
        { label: "Logout", icon: <ListItemIcon><Logout fontSize="small" /></ListItemIcon> },
    ]

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>

            <Tooltip title="Account settings">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    // sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    {/* <Avatar src="/broken-image.jpg" className='w-8 h-8' /> */}
                    <PersonPin fontSize='large' />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 20,
                                height: 20,
                                ml: -0.5,
                                mr: 1,
                                fontSize: '0.75rem',
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
           
                {
                    menuOptions.map((menu, index) =>
                        menu.divider ? (
                            <Divider key={index} />
                        ) :
                            (
                                <MenuItem onClick={handleClose} key={index}>
                                    {menu.icon}
                                    {menu.label}
                                </MenuItem>
                            )
                    )
                }
            </Menu>
        </>
    );
}