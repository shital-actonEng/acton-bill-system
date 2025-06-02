
"use client"
import * as React from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { Menu, MenuOpen, AppRegistration, HealthAndSafety, Vaccines, History, PersonAddAlt1 } from '@mui/icons-material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, Button, Collapse, FormControl, FormControlLabel, InputLabel, MenuItem, Select } from '@mui/material';
import ProfileAvatar from '@/components/ProfileAvatar';
import Image from 'next/image';
import Link from 'next/link';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Switch from '@mui/material/Switch';
import { useThemeStore } from '@/stores/themeStore';
import { usePathname } from 'next/navigation';
import { getDiagnosticCenter } from '@/express-api/diagnosticCenter/page';
import { useBranchStore } from '@/stores/branchStore';


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

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
        margin: 1,
        padding: 0,
        transform: "translateX(6px)",
        "&.Mui-checked": {
            color: "#fff",
            transform: "translateX(22px)",
            "& .MuiSwitch-thumb:before": {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    "#fff"
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            "& + .MuiSwitch-track": {
                opacity: 1,
                backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
            },
        },
    },
    "& .MuiSwitch-thumb": {
        backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
        width: 32,
        height: 32,
        "&:before": {
            content: "''",
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                "#fff"
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    "& .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
        borderRadius: 20 / 2,
    },
}));


export default function Header({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(true);
    const menuList = [
        {
            id: 1,
            name: "Active Invoices",
            icon: <AppRegistration />,
            path: "/registeredpatients"
        },
        {
            id: 2,
            name: "Patient Registration",
            icon: <PersonAddAlt1 />,
            path: "/patientdashboard"
            // nestedItems: [
            //     { id: 3, text: 'Add New Patient', icon: <AddIcon />, path: "/patientdashboard/addpatient" },
            //     { id: 4, text: 'Edit Patient', icon: <EditNoteIcon />, path: "/patientdashboard/editpatient" },
            // ],
        },
        {
            id: 3,
            name: "Healthcare Referrals",
            icon: <HealthAndSafety />,
            path: "/referraldashboard"
            // nestedItems: [
            //     { id: 6, text: 'New Referral', icon: <AddIcon />, path: "/referraldashboard/addreferral" },
            //     { id: 7, text: 'Edit Referral ', icon: <EditNoteIcon />, path: "/referraldashboard/editreferral" },
            // ],
        },
        {
            id: 8,
            name: "Test Records",
            icon: <Vaccines />,
            path: "/testrecords"
        },
        {
            id: 9,
            name: "History",
            icon: <History />,
            path: "/history"
        }
    ]
    const [branchOption, setBranchOption] = React.useState<{ pk: number; name: string; ae_title: string }[]>([])
    const [loading, setLoading] = React.useState(false);
    const [openList, setOpenList] = React.useState<Record<number, boolean>>({});
    const branch = useBranchStore((state) => state.selectedBranch);
    const setBranch = useBranchStore((state) => state.setSelectedBranch);
    const [hasHydrated, setHasHydrated] = React.useState(false);

    React.useEffect(() => {
        setHasHydrated(true);
    }, []);

    const handleClick = (id: any) => {
        setOpenList((prevOpen) => ({ ...prevOpen, [id]: !prevOpen[id] }));
    };

    const toggleTheme = useThemeStore((state) => state.toggleTheme);

    const loadBranches = async () => {
        try {
            setLoading(true);
            const result = await getDiagnosticCenter();
            setBranchOption(result);
        } catch (error) {
            console.log("Failed to load referrer", error);
        }
        finally {
            setLoading(false);
        }
    }

    React.useEffect(()=>{
        loadBranches();
    } , [])

    const handleBranch = (e: any) => {
        const selected = branchOption.find(b => b.pk === e.target.value);
        if (selected) setBranch(selected);
    }

    const pathname = usePathname();
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
                        {open ? <MenuOpen /> : <Menu />}
                    </IconButton>

                    <Box sx={{ flexGrow: 1 }} component="div" color='success'>
                        <Image src="/actonlogo.jpeg" alt='Acton logo' width={150} height={150} priority />
                    </Box>

                    <div>
                        <FormControlLabel
                            control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked />}
                            label=""
                            onClick={toggleTheme}
                        />
                    </div>

                    <Typography className='font-medium text-sm mr-2'>Shital Bambare</Typography>
                    {/* <Avatar src="/broken-image.jpg" className='w-8 h-8' />       */}
                    <ProfileAvatar />
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader className='bg-[#edf2f9]'>

                </DrawerHeader>
                {/* <Divider /> */}
                <List className='mt-2'>
                    {/*  Add Branch Selector at the top of the menu */}
                    <ListItem className="px-4 mb-4">

                        <FormControl size="small" variant='outlined' className=' w-11/12'
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white', // 👈 sets the border color
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                            }}
                        >
                            <InputLabel id="branches" className='text-white'>Branches</InputLabel>
                            {hasHydrated && (
                            <Select
                                labelId="branches"
                                id="branches"
                                value={branch?.pk ?? ""}
                                label="Branches"
                                // onChange={(e) => setBranch(e.target.value)}
                                onChange={handleBranch}
                                // onOpen={loadBranches}
                            >
                                {loading ? (
                                    <MenuItem disabled>
                                        <span style={{ marginLeft: 10 }}>Loading...</span>
                                    </MenuItem>
                                ) : (
                                    branchOption.map((data, index) => (
                                        <MenuItem value={data.pk} key={index}>
                                            {data.name}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                            )}
                        </FormControl>
                    </ListItem>
                    <Divider />
                    {
                        menuList.map((menu, index) =>
                            <ListItem key={index} disablePadding className='block mb-2'>
                                <Link href={menu.path || "#"} passHref legacyBehavior>
                                    <ListItemButton
                                        selected={pathname === menu.path}
                                        onClick={() => menu.nestedItems && handleClick(menu.id)}
                                        sx={[
                                            {
                                                px: 2.5
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
