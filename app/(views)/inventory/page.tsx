"use client"
import { InventoryCreateType } from "@/app/types/inventoryType";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import { useFormik } from 'formik';
import * as Yup from 'yup';
function Inventory() {
    const loginSchema = Yup.object().shape({
        name: Yup.string().required("Este campo es requerido"),
        stock: Yup.string().required("Este campo es requerido"),
    });
    const formik = useFormik<InventoryCreateType>({
        initialValues: {
            name: "",
            stock: ""
        },
        enableReinitialize: false, // ✅ Reemplaza al useEffect para actualizar valores
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            console.log(values);

        },
    });
    return (<><Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
            <Card sx={{ minWidth: 275 }}
                component="form"
                autoComplete='off'
                onSubmit={formik.handleSubmit}
            >
                <CardContent>
                    <Typography gutterBottom sx={{ textAlign: "center", fontSize: 18 }}>
                        Crear existencia
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
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                name="stock"
                                label="Existencia"
                                variant="outlined"
                                type="number"
                                value={formik.values.stock}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.stock && Boolean(formik.errors.stock)}
                                helperText={formik.touched.stock && formik.errors.stock}
                            />
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

        </Grid>
    </Grid> </>);
}
export default Inventory;