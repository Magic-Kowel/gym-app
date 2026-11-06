"use client"
import BackButton from "@/app/components/BackButton";
import { Alert, Button, Card, CardActions, CardContent, Grid, TextField } from "@mui/material";
import { use, useEffect, useRef, useState } from "react";
import { fetchAdmind, updateAdmind, validateUpdateEmail, validateUpdatePhone } from "@/app/store/Slices/admindSlice";
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { admindUpdateType } from "@/app/types/admind";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { CharacterCounter } from "@/app/components/CharacterCounter";

interface UpdateAdmindProps {
    params: Promise<{ id: string }>;
}
interface validation {
    error: boolean
    message: string
}
function UpdateAdmind({ params }: UpdateAdmindProps) {
    const effectRan = useRef(false);
    const resolvedParams = use(params);
    const admindId = Number(resolvedParams.id);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { adminds: dataAdmind } = useAppSelector((state) => state.admind);
    const [validationEmail, setValidationEmail] = useState<validation>({
        error: false,
        message: ""
    });
    const [validationPhone, setValidationPhone] = useState<validation>({
        error: false,
        message: ""
    });
    useEffect(() => {
        if (!effectRan.current) {
            effectRan.current = true;
            dispatch(fetchAdmind(admindId));
        }
    }, []);
    const admindValidationSchema = Yup.object().shape({
        name: Yup.string().required("Este campo es requerido"),
        middle_name: Yup.string().required("Este campo es requerido"),
        last_name: Yup.string().required("Este campo es requerido"),
        birthdate: Yup.string().required("Este campo es requerido"),
        phone: Yup.string().required("Este campo es requerido"),
        email: Yup.string().email("Correo inválido").required("Este campo es requerido"),
    });
    const handleUpdate = async (data: admindUpdateType) => {
        const dataUpdate = { ...data, admindId };
        const response = await dispatch(updateAdmind(dataUpdate));
        if (response.payload.updated) {
            Swal.fire({
                title: "Editado con exito",
                icon: 'success',
                timer: 1500
            });
            router.back();
            return false;
        }
    }
    const formik = useFormik<admindUpdateType>({
        initialValues: {
            name: dataAdmind[0]?.name || "",
            email: dataAdmind[0]?.email || "",
            middle_name: dataAdmind[0]?.middle_name || "",
            last_name: dataAdmind[0]?.last_name || "",
            birthdate: dataAdmind[0]?.birthdate ? dataAdmind[0].birthdate.split('T')[0] : "",
            phone: dataAdmind[0]?.phone || ""

        },
        enableReinitialize: true, // ✅ Reemplaza al useEffect para actualizar valores
        validationSchema: admindValidationSchema,
        onSubmit: async (values) => {
            const validationEmail = await dispatch(validateUpdateEmail({ email: values.email, id: admindId }));
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
            const validationPhone = await dispatch(validateUpdatePhone({ email: values.phone, id: admindId }));
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
            await handleUpdate(values);
        },
    });
    return (<>
        <BackButton />

        <Grid container spacing={2} sx={{
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Grid size={8}>
                <Card sx={{ minWidth: 275 }}>
                    <form onSubmit={formik.handleSubmit}>
                        <CardContent >
                            <Grid container spacing={2}>
                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        name="name"
                                        label="Nombre"
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
                                        name="middle_name"
                                        label="Segundo nombre"
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
                                        name="last_name"
                                        label="Apellido"
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
                                        name="phone"
                                        label="Telefono"
                                        type="text"
                                        variant="outlined"
                                        value={formik.values.phone}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^\d*$/.test(val)) {
                                                formik.handleChange(e);
                                            }
                                        }}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                                        helperText={formik.touched.phone && formik.errors.phone}
                                        slotProps={{
                                            htmlInput: { maxLength: 10 }
                                        }}
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
                                        name="birthdate"
                                        label="Fecha de nacimiento"
                                        variant="outlined"
                                        slotProps={{
                                            inputLabel: { shrink: true },
                                        }}
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
                                        name="email"
                                        label="Email"
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
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <Button fullWidth variant="contained" type="submit">
                                Editar
                            </Button>
                        </CardActions>
                    </form>
                </Card>
            </Grid>
        </Grid>
    </>)
}
export default UpdateAdmind;