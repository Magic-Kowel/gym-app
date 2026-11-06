"use client"
import {
    use,
    useState,
    useEffect,
} from "react";
import { getMembership } from "@/app/services/getMembership";
import BackButton from "@/app/components/BackButton";
import { Button, Card, CardContent, Container, Grid, TextField, Typography } from "@mui/material";
import * as Yup from 'yup';
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";
import { baseURL } from "@/app/config";
import { CharacterCounter } from "@/app/components/CharacterCounter";


// Asumimos el tipo de una sola membresía
interface MembershipType {
    id_membership: number;
    name: string;
    price: number;
    id_status: number;
    days: number;
}

interface UpdateMembershipProps {
    params: Promise<{ id: string }>;
}
interface UpdateMembership {
    name: string;
    price: number;
    days: number;
}

function UpdateMembership({ params }: UpdateMembershipProps) {
    const resolvedParams = use(params);
    const membershipId = Number(resolvedParams.id);

    // 1. Estado como objeto único o null (inicialmente null)
    const [membership, setMembership] = useState<MembershipType | null>(null);
    const router = useRouter();
    // 2. Carga de datos con extracción del objeto
    useEffect(() => {
        if (!membershipId) return;
        getMembership(membershipId)
            .then((response) => {
                // Si el endpoint responde un arreglo [membership], tomamos el elemento 0
                const data = Array.isArray(response) ? response[0] : response;
                setMembership(data || null);
            })
            .catch((error) => {
                console.error("Error al editar la membresía:", error);
            })
    }, [membershipId]);

    const updateMembership = async (membership: UpdateMembership) => {
        const data = { ...membership, membershipId: membershipId }
        console.log(data);
        try {
            const response = await axios.put(`${baseURL}membership`, data);
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
            console.error("Error al editar usuarios:", error);
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
            name: membership?.name || "",
            price: membership?.price || 0,
            days: membership?.days || 0,
        },
        validationSchema: membershipSchema,
        onSubmit: async (values) => {
            await updateMembership(values);
        },
    });


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
                                Editar Membrecía
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
            </Container>
        </>
    );
}
export default UpdateMembership;