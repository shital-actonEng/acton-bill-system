
"use client"
import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Avatar, Button, Collapse, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import ProfileAvatar from '@/components/ProfileAvatar';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import HistoryIcon from '@mui/icons-material/History';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Image from 'next/image';
import Link from 'next/link';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AddIcon from '@mui/icons-material/Add';
import path from 'path';
import GroupsIcon from '@mui/icons-material/Groups';


const drawerWidth = 230;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    // backgroundColor: '#37C2CC',
    color: 'white',
    fontSize: '10px',
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    // margin: 8
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    // backgroundColor: '#37C2CC',
    color: 'white',
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
    // margin: 8
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'sticky',  // 🔥 Make header sticky
    top: 0,
    zIndex: 10,
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                // marginLeft: drawerWidth,
                // width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        '& .MuiDrawer-paper': {
            border: 'none',       // 💥 Remove border
            boxShadow: 'none',    // 💥 Remove shadow
            // backgroundColor: '#89cb4e', 
            color: 'white'
        },

        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': {
                        ...openedMixin(theme),
                    },
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': {
                        ...closedMixin(theme),
                    },
                },
            },
        ],
    }),
);

export default function Header({ children }: { children: React.ReactNode }) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const menuList = [
        {
            id: 1,
            name: "Active Patients",
            icon: <AppRegistrationIcon />,
            path: "/registeredpatients"
        },
        {
            id: 2,
            name: "Patient Registration",
            icon: <PersonAddAlt1Icon />,
            path: "/patientdashboard"
            // nestedItems: [
            //     { id: 3, text: 'Add New Patient', icon: <AddIcon />, path: "/patientdashboard/addpatient" },
            //     { id: 4, text: 'Edit Patient', icon: <EditNoteIcon />, path: "/patientdashboard/editpatient" },
            // ],
        },
        {
            id: 3,
            name: "Healthcare Referrals",
            icon: <HealthAndSafetyIcon />,
            path: "/referraldashboard"
            // nestedItems: [
            //     { id: 6, text: 'New Referral', icon: <AddIcon />, path: "/referraldashboard/addreferral" },
            //     { id: 7, text: 'Edit Referral ', icon: <EditNoteIcon />, path: "/referraldashboard/editreferral" },
            // ],
        },
        {
            id: 8,
            name: "Test Records",
            icon: <VaccinesIcon />,
            path: "/testrecords"
        },
        {
            id: 9,
            name: "History",
            icon: <HistoryIcon />,
            path: "/history"
        }
    ]

    const [openList, setOpenList] = React.useState<Record<number, boolean>>({});

    const handleClick = (id: any) => {
        setOpenList((prevOpen) => ({ ...prevOpen, [id]: !prevOpen[id] }));
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* <CssBaseline /> */}
            <AppBar position="fixed" open={open} className='' color='default'>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setOpen(!open)}
                        edge="start"
                        sx={[
                            {
                                marginRight: 1,
                            },

                        ]}
                    >
                        {open ? <MenuOpenIcon /> : <MenuIcon />}
                    </IconButton>
                    <Typography variant="h5" sx={{ flexGrow: 1 }} noWrap component="div" color='success'>
                        <Image src="/actonlogo.jpeg" alt='Acton logo' width={150} height={150} />
                    </Typography>

                    <Typography className='font-medium text-sm mr-2'>Shital Bambare</Typography>
                    {/* <Avatar src="/broken-image.jpg" className='w-8 h-8' />       */}
                    <ProfileAvatar />
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader className='bg-[#edf2f9]'>

                </DrawerHeader>
                {/* <Divider /> */}
                <List className='mt-8'>
                    {/*  Add Branch Selector at the top of the menu */}
                    <ListItem className="px-4 mb-4">
                        {/* <select    
                            // value={branch}
                            // onChange={(e) => setBranch(e.target.value)}
                            className="w-full p-2 bg-inherit" 
                        >
                            <option value="main">Main Branch</option>
                            <option value="branch1">Branch 1</option>
                            <option value="branch2">Branch 2</option>
                        </select> */}
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small" variant='standard' className='bg-dropdown-base text-dropdown-text z-50 border-none w-11/12'>
                            <InputLabel id="demo-select-small-label" className='text-dropdown-text'>Branches</InputLabel>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                // value={age}
                                label="Branches"
                                // onChange={handleChange}
                                className='text-dropdown-text'
                                MenuProps={{
                                    PaperProps: {
                                      className: 'bg-dropdown-base z-50', // 👈 Background for the dropdown menu
                                    },
                                  }}
                            >
                                <MenuItem value={10} className='bg-dropdown-base text-dropdown-text'>Main Branch</MenuItem>
                                <MenuItem value={20} className='bg-dropdown-base text-dropdown-text' >Branch 1</MenuItem>
                                <MenuItem value={30} className='bg-dropdown-base text-dropdown-text'>Branch 2</MenuItem>
                            </Select>
                        </FormControl>
                    </ListItem>
                    {
                        menuList.map((menu, index) =>
                            <ListItem key={index} disablePadding className='block mb-2'>
                                <Link href={menu.path || "#"} passHref legacyBehavior>
                                    <ListItemButton
                                        onClick={() => menu.nestedItems && handleClick(menu.id)}
                                        sx={[
                                            {
                                                minHeight: 48,
                                                px: 2.5,
                                            },
                                            open
                                                ? {
                                                    justifyContent: 'initial',
                                                }
                                                : {
                                                    justifyContent: 'center',
                                                },
                                        ]}
                                    >
                                        <ListItemIcon
                                            sx={[
                                                {
                                                    minWidth: 0,
                                                    justifyContent: 'center',
                                                    color: 'white'
                                                },
                                                open
                                                    ? {
                                                        mr: 1,
                                                    }
                                                    : {
                                                        mr: 'auto',
                                                    },
                                            ]}
                                        >
                                            {menu.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            sx={[
                                                open
                                                    ? {
                                                        opacity: 1,
                                                    }
                                                    : {
                                                        opacity: 0,
                                                    },
                                            ]}
                                        >
                                            {menu.name}
                                            {menu.nestedItems && menu.id !== undefined && (openList[menu.id] ? <ExpandLess /> : <ExpandMore />)}
                                        </ListItemText>
                                    </ListItemButton>
                                </Link>
                                {menu.nestedItems && (
                                    <Collapse in={openList[menu.id]} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {menu.nestedItems.map((nested) => (
                                                <Link href={nested.path || '#'} passHref legacyBehavior key={nested.id}>
                                                    <ListItemButton key={nested.id} sx={{ pl: 4 }}>
                                                        <ListItemIcon
                                                            sx={[
                                                                {
                                                                    minWidth: 0,
                                                                    justifyContent: 'center',
                                                                    color: 'white'
                                                                },
                                                                open
                                                                    ? {
                                                                        mr: 1,
                                                                    }
                                                                    : {
                                                                        mr: 'auto',
                                                                    },
                                                            ]}
                                                        >{nested.icon}</ListItemIcon>
                                                        <ListItemText primary={nested.text}
                                                            sx={[
                                                                open
                                                                    ? {
                                                                        opacity: 1,
                                                                    }
                                                                    : {
                                                                        opacity: 0,
                                                                    },
                                                            ]}
                                                        />
                                                    </ListItemButton>
                                                </Link>
                                            ))}
                                        </List>
                                    </Collapse>
                                )}

                            </ListItem>
                        )
                    }
                </List>

            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {children}
            </Box>
        </Box>
    );
}
