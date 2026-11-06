import { AppBar, Toolbar, Typography, Box } from "@mui/material";

function Menu({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AppBar position="fixed">
                <Toolbar variant="dense">
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ color: 'inherit' }}
                    >
                        GYM
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* 🟢 Contenedor que empuja el contenido hacia abajo para que no lo tape la barra */}
            <Box component="main" sx={{ pt: '58px' }}>
                {children}
            </Box>
        </>
    );
}

export default Menu;