"use client"
import { useState } from "react";
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import {
    Button, Card, CardActions, CardContent, Grid, Typography, TextField,
    Box,
    IconButton
} from "@mui/material";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { LoginType } from "./types/user";
import { useAppDispatch, useAppSelector } from './store/hooks'
import { login } from "./store/Slices/userSlice";
function Homepage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const handleValidate = (token: string) => {
        document.cookie = `token=${token}; path=/; max-age=86400; secure; samesite=lax`;
        router.refresh();
        router.push('/users');
    }
    const loginSchema = Yup.object().shape({
        email: Yup.string().email("Correo inválido").required("Este campo es requerido"),
        password: Yup.string().required("Este campo es requerido"),
    });
    const formik = useFormik<LoginType>({
        initialValues: {
            email: "",
            password: ""
        },
        enableReinitialize: false, // ✅ Reemplaza al useEffect para actualizar valores
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            const response = await dispatch(login(values));
            if (response.payload.auth) {
                handleValidate(response.payload.token);
            }
            console.log(response);
        },
    });
    const [showPassword, setShowPassword] = useState<boolean>(false)
    return (
        <>
            <Grid container spacing={2}
                sx={{
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <Grid size={{ sm: 12, md: 8, lg: 4 }}>
                    <Card sx={{ boxShadow: '0 8px 24px rgba(0,0,0,0.94)', }}>
                        <form
                            autoComplete='off'
                            onSubmit={formik.handleSubmit}
                        >
                            <CardContent>
                                <Typography
                                    sx={{ textAlign: "center" }}
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                >
                                    Login
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <TextField
                                            fullWidth
                                            label="Usuario"
                                            name="email"
                                            variant="outlined"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.email && Boolean(formik.errors.email)}
                                            helperText={formik.touched.email && formik.errors.email}
                                        />
                                    </Grid>
                                    <Grid size={12}>
                                        <Box sx={{ display: "flex" }}>
                                            <TextField
                                                fullWidth
                                                label="Contraseña"
                                                name="password"
                                                variant="outlined"
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.password && Boolean(formik.errors.password)}
                                                helperText={formik.touched.password && formik.errors.password}
                                            />
                                            <IconButton aria-label="show" size="large" onClick={() => setShowPassword((prev) => !prev)}>
                                                {showPassword ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <CardActions>
                                <Button fullWidth variant="contained" type="submit">Login</Button>
                            </CardActions>
                        </form>
                    </Card>
                </Grid>
            </Grid>
        </>

    )
}
export default Homepage;