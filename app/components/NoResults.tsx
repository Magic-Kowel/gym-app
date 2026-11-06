import { Box, Typography } from "@mui/material";

function NoResults({ message }: { message: string }) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80svh"
            }}
        >
            <Typography
                sx={{

                    fontSize: "clamp(1.5rem, 4vw + 1rem, 3rem);"
                }}
                color="textSecondary"
            >
                {message}
            </Typography>
        </Box>
    );
}
export default NoResults;