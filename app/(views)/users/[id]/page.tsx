"use client";

import { use, useEffect, useState, useRef } from "react";
import { getUser } from "@/app/services/getUser";
import { User } from "@/app/types/user";
import { Button, Card, CardContent, Container, Grid, TextField, Typography } from "@mui/material";
import * as Yup from 'yup';
import { useFormik } from "formik";
import BackButton from "@/app/components/BackButton";
import axios from "axios";
import { baseURL } from "@/app/config";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { CharacterCounter } from "@/app/components/CharacterCounter";
interface UpdateUserProps {
    params: Promise<{ id: string }>;
}
import { UpdateUsertype } from "@/app/types/user";
export default function UpdateUser({ params }: UpdateUserProps) {
    // 1. Desempaquetamos los params usando React.use()
    const resolvedParams = use(params);
    const userId = Number(resolvedParams.id);

    const [user, setUser] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const effectRan = useRef(false);
    const updateUser = async (user: UpdateUsertype) => {
        const data = { ...user, userId: userId }
        try {
            const response = await axios.put(`${baseURL}user`, data);
            console.log(response?.data);
            if (response?.data.updated) {
                Swal.fire({
                    title: "Editado con exito",
                    icon: 'success',
                    timer: 1500
                });
                router.back()
                return false;
            }
            return response.data;
        } catch (error) {
            console.error("Error al crear usuarios:", error);
        }
    }


    // 2. Cargamos los datos del usuario al montar el componente o cambiar de ID
    useEffect(() => {
        if (!effectRan.current) {
            effectRan.current = true;
            const fetchUserData = async () => {
                try {
                    setLoading(true);
                    const data = await getUser(userId);
                    const userData = Array.isArray(data) ? data : [];

                    if (userData) {
                        setUser(userData);
                    }
                } catch (error) {
                    console.error("Error al obtener el usuario:", error);
                } finally {
                    setLoading(false);
                }
            };

            if (userId) {
                fetchUserData();
            }
        }
    }, [userId]);
    const userValidationSchema = Yup.object({
        name: Yup.string().required("El nombre es obligatorio").trim(),
        middle_name: Yup.string().optional().trim(),
        last_name: Yup.string().required("El apellido es obligatorio").trim(),
        email: Yup.string().email("Correo no válido").required("El correo es obligatorio").trim(),
        phone: Yup.string().required("El teléfono es obligatorio").trim(),
        birthdate: Yup.string().required("La fecha de nacimiento es obligatoria").trim(),
    });
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: user[0]?.name || "",
            middle_name: user[0]?.middle_name || "",
            last_name: user[0]?.last_name || "",
            email: user[0]?.email || "",
            phone: user[0]?.phone || "",
            birthdate: user[0]?.birthdate,
        },
        validationSchema: userValidationSchema,
        onSubmit: async (values) => {
            updateUser(values);
        },
    });
    if (loading) return <p>Cargando datos del usuario...</p>;

    return (
        <>
            <Container maxWidth="lg">
                <BackButton />
                <Grid
                    container
                    direction="row"
                    sx={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Card sx={{ maxWidth: 545 }}>
                        <CardContent>
                            <Typography gutterBottom sx={{ textAlign: "center", fontSize: 18 }}>
                                Editar Usuario
                            </Typography>
                            <form onSubmit={formik.handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <TextField
                                            id="name"
                                            label="Nombre"
                                            variant="outlined"
                                            fullWidth
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
                                            id="middle_name"
                                            label="Segundo nombre"
                                            variant="outlined"
                                            fullWidth
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
                                            id="last_name"
                                            label="Apellido"
                                            variant="outlined"
                                            fullWidth
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
                                            id="email"
                                            label="Correo"
                                            variant="outlined"
                                            fullWidth
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
                                    </Grid>
                                    <Grid size={12}>
                                        <TextField
                                            id="phone"
                                            label="Telefono"
                                            variant="outlined"
                                            fullWidth
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
                                    </Grid>
                                    <Grid size={12}>
                                        <TextField id="birthdate"
                                            variant="outlined"
                                            fullWidth
                                            type="date"
                                            value={formik.values.birthdate}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.birthdate && Boolean(formik.errors.birthdate)}
                                            helperText={formik.touched.birthdate && formik.errors.birthdate} />
                                    </Grid>
                                    <Grid size={12}>
                                        <Button type="submit" variant="contained" fullWidth>Editar</Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>

                    </Card>

                </Grid>
            </Container>
        </>
    );
}