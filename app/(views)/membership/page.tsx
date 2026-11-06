"use client"
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import CardMembership from './CardMembership';
import { MembershipType } from '@/app/types/memberships';
import { Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { baseURL } from '@/app/config';
import Swal from 'sweetalert2';
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchMembership } from '../../store/Slices/membershipSlice'
import NoResults from '@/app/components/NoResults';
import { CharacterCounter } from '@/app/components/CharacterCounter';
function Membership() {

    const dispatch = useAppDispatch()

    // 1. Sacar la data, el estatus y el error del store de Redux
    const { data: memberships, status, error } = useAppSelector((state) => state.memberships)

    // 2. Disparar la petición Axios cuando el componente cargue por primera vez
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchMembership())
        }
    }, [status, dispatch])

    const createMembership = async (membership: MembershipType) => {
        try {
            const response = await axios.post(`${baseURL}membership`, membership);
            if (response?.data.created) {
                Swal.fire({
                    title: "Creado con exito",
                    icon: 'success',

                });
                dispatch(fetchMembership())
                formik.resetForm();
            }
        } catch (error) {
            console.error("Error al crear membership:", error);
        }
    }
    const membershipSchema = Yup.object({
        name: Yup.string().required("El nombre es obligatorio").trim(),
        price: Yup.number()
            .required("El Precio es obligatorio")
            .min(0, "El precio no puede ser negativo"),
        days: Yup.number().required("Los dias son obligatorio")
            .min(1, "La cantidad minima es 1"),
    });
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: "",
            price: 0,
            days: 0,
        },
        validationSchema: membershipSchema,
        onSubmit: async (values) => {
            createMembership(values);
        },
    });
    return (<>
        <Grid
            container
            spacing={{ xs: 2, md: 3 }}

        >
            <Grid
                size={{ xs: 12, sm: 12, md: 6, lg: 5 }}
                spacing={2}
                sx={{
                    alignItems: "center",
                }}
            >
                <Card sx={{ maxWidth: 545 }}>
                    <CardContent>
                        <Typography gutterBottom sx={{ textAlign: "center", fontSize: 18 }}>
                            Crear Membrecía
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
                                            htmlInput: {
                                                maxLength: 30
                                            },
                                        }}
                                    />
                                    <CharacterCounter value={formik.values.name} max={30} />
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        id="price"
                                        label="Precio"
                                        variant="outlined"
                                        fullWidth
                                        type="text"
                                        value={formik.values.price}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^\d*$/.test(val)) {
                                                formik.handleChange(e);
                                            }
                                        }}
                                        slotProps={{
                                            htmlInput: {
                                                inputMode: "numeric",
                                                pattern: "[0-9]*",
                                                maxLength: 6
                                            },
                                        }}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.price && Boolean(formik.errors.price)}
                                        helperText={formik.touched.price && formik.errors.price}
                                    />
                                    <CharacterCounter value={formik.values.price} max={6} />
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        id="days"
                                        label="Dias"
                                        variant="outlined"
                                        fullWidth
                                        type="text"
                                        value={formik.values.days}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^\d*$/.test(val)) {
                                                formik.handleChange(e);
                                            }
                                        }}
                                        slotProps={{
                                            htmlInput: {
                                                inputMode: "numeric",
                                                pattern: "[0-9]*",
                                                maxLength: 3
                                            },
                                        }}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.days && Boolean(formik.errors.days)}
                                        helperText={formik.touched.days && formik.errors.days}
                                    />
                                    <CharacterCounter value={formik.values.days} max={3} />
                                </Grid>
                                <Grid size={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth>
                                        Editar
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
            {memberships.length ? <>
                <Grid
                    container
                    size={{ xs: 12, sm: 12, md: 7, lg: 7 }}
                    spacing={2}
                >
                    {memberships.map((item, index) => (
                        <Grid key={index} size={{ xs: 12, sm: 12, md: 6, lg: 6 }} spacing={2}>
                            <CardMembership membership={item} />
                        </Grid>
                    ))}
                </Grid>
            </> : <NoResults message="No hay Membrecías por mostrar" />}

        </Grid>
    </>)
}
export default Membership;