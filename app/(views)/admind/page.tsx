"use client"
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Alert, Box, IconButton, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import NoResults from '@/app/components/NoResults';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { createAdmind, fetchAdminds, validateEmail, validatePhone } from '@/app/store/Slices/admindSlice';
import { admindCreateType } from '@/app/types/admind';
import Swal from 'sweetalert2';
import AdmindList from "./AdmindList"
import { CharacterCounter } from '@/app/components/CharacterCounter';
interface validation {
    error: boolean
    message: string
}
function Admind() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [validationEmail, setValidationEmail] = useState<validation>({
        error: false,
        message: ""
    });
    const [validationPhone, setValidationPhone] = useState<validation>({
        error: false,
        message: ""
    });
    const dispatch = useAppDispatch();
    const { adminds: dataAdminds, status } = useAppSelector((state) => state.admind);
    const effectRan = useRef(false);
    useEffect(() => {
        if (!effectRan.current) {
            effectRan.current = true;
            dispatch(fetchAdminds());
        }
    }, []);
    const admindValidationSchema = Yup.object().shape({
        name: Yup.string().required("Este campo es requerido"),
        middle_name: Yup.string().required("Este campo es requerido"),
        last_name: Yup.string().required("Este campo es requerido"),
        birthdate: Yup.string().required("Este campo es requerido"),
        phone: Yup.string().required("Este campo es requerido").max(13),
        email: Yup.string().email("Correo inválido").required("Este campo es requerido"),
        password: Yup.string().required("Este campo es requerido"),
        password2: Yup.string()
            .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
            .required('Este campo es requerido'),
    });

    const handleSubmit = async (values: admindCreateType) => {
        if (values) {
            const result = await dispatch(createAdmind(values));
            if (result.payload.created) {
                Swal.fire({
                    title: "Creado con exito",
                    icon: 'success',
                    timer: 1500
                });
                console.log(dataAdminds);
                dispatch(fetchAdminds());
                return true;
            } else {
                await Swal.fire({
                    title: "Error",
                    text: result.payload.message,
                    icon: "error",
                    timer: 1500
                });
                return false;
            }
        }
    };
    const formik = useFormik<admindCreateType>({
        initialValues: {
            name: "",
            email: "",
            middle_name: "",
            last_name: "",
            birthdate: "",
            phone: "",
            password: "",
            password2: "",
        },
        enableReinitialize: false, // ✅ Reemplaza al useEffect para actualizar valores
        validationSchema: admindValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            const validationEmail = await dispatch(validateEmail(values.email));
            console.log(validationEmail);
            if (!validationEmail.payload.valid) {
                setValidationEmail({
                    error: true,
                    message: "El correo electrónico ya se encuentra registrado"
                });
                return false;
            } else {
                setValidationEmail({
                    error: false,
                    message: ""
                });
            }
            const validationPhone = await dispatch(validatePhone(values.phone));
            console.log(validationPhone.payload);
            if (!validationPhone.payload.valid) {
                setValidationPhone({
                    error: true,
                    message: "El telefono ya se encuentra registrado"
                });
                return false;
            } else {
                setValidationPhone({
                    error: false,
                    message: ""
                });
            }
            const response = await handleSubmit(values);
            if (response) {
                resetForm(); // Limpia el formulario de Formik
            }
        },
    });
    return (<>
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                <Card sx={{ minWidth: 275 }}
                    component="form"
                    autoComplete='off'
                    onSubmit={formik.handleSubmit}
                >
                    <CardContent>
                        <Typography gutterBottom sx={{ textAlign: "center", fontSize: 18 }}>
                            Crear Admind
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    name="name"
                                    variant="outlined"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                    slotProps={{
                                        htmlInput: { maxLength: 20 }
                                    }}
                                />
                                <CharacterCounter value={formik.values.name} max={20} />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    label="Segundo nombre"
                                    name="middle_name"
                                    variant="outlined"
                                    value={formik.values.middle_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.middle_name && Boolean(formik.errors.middle_name)}
                                    helperText={formik.touched.middle_name && formik.errors.middle_name}
                                    slotProps={{
                                        htmlInput: { maxLength: 20 }
                                    }}
                                />
                                <CharacterCounter value={formik.values.middle_name} max={20} />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    label="Apellido"
                                    name="last_name"
                                    variant="outlined"
                                    value={formik.values.last_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                                    helperText={formik.touched.last_name && formik.errors.last_name}
                                    slotProps={{
                                        htmlInput: { maxLength: 30 }
                                    }}
                                />
                                <CharacterCounter value={formik.values.last_name} max={30} />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    label="Telefono"
                                    name="phone"
                                    type="text"
                                    variant="outlined"
                                    value={formik.values.phone}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^\d*$/.test(val)) {
                                            formik.handleChange(e);
                                        }
                                    }}
                                    slotProps={{
                                        htmlInput: { maxLength: 10 }
                                    }}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText={formik.touched.phone && formik.errors.phone}
                                />
                                <CharacterCounter value={formik.values.phone} max={10} />
                                {
                                    validationPhone.error && (
                                        <Alert sx={{ mt: 1 }} variant="filled" severity="error">
                                            {validationPhone.message}
                                        </Alert>
                                    )
                                }
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    label="Fecha de nacimiento"
                                    slotProps={{
                                        inputLabel: { shrink: true },
                                    }}
                                    name="birthdate"
                                    variant="outlined"
                                    type="date"
                                    value={formik.values.birthdate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.birthdate && Boolean(formik.errors.birthdate)}
                                    helperText={formik.touched.birthdate && formik.errors.birthdate}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    variant="outlined"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                    slotProps={{
                                        htmlInput: { maxLength: 50 }
                                    }}
                                />
                                <CharacterCounter value={formik.values.email} max={50} />
                                {
                                    validationEmail.error && (
                                        <Alert sx={{ mt: 1 }} variant="filled" severity="error">
                                            {validationEmail.message}
                                        </Alert>
                                    )
                                }
                            </Grid>
                            <Grid size={12}>
                                <Box sx={{ display: "flex" }}>
                                    <TextField
                                        fullWidth
                                        name="password"
                                        label="Contraseña"
                                        variant="outlined"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        type={showPassword ? "text" : "password"}
                                        error={formik.touched.password && Boolean(formik.errors.password)}
                                        helperText={formik.touched.password && formik.errors.password}
                                        slotProps={{
                                            htmlInput: { maxLength: 30 }
                                        }}
                                    />
                                    <IconButton
                                        aria-label="show"
                                        size="large"
                                        onClick={() => setShowPassword((prev) => !prev)}>
                                        {showPassword ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </Box>
                                <CharacterCounter value={formik.values.password || ""} max={30} />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    value={formik.values.password2}
                                    fullWidth
                                    name="password2"
                                    label="Repetir Contraseña"
                                    variant="outlined"
                                    type="password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password2 && Boolean(formik.errors.password2)}
                                    helperText={formik.touched.password2 && formik.errors.password2}
                                    slotProps={{
                                        htmlInput: { maxLength: 30 }
                                    }}
                                />
                                <CharacterCounter value={formik.values.password2 || ""} max={30} />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Button
                            variant="contained"
                            fullWidth
                            type="submit"
                        >Guardar</Button>
                    </CardActions>
                </Card>
            </Grid>
            <Grid size={8}>

                {dataAdminds.length ? <>
                    <AdmindList adminds={dataAdminds || []} />
                </> : <>
                    <NoResults message="No hay Adminds por mostrar" />
                </>}
            </Grid>
        </Grid>
    </>)
}
export default Admind