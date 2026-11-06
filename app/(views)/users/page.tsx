"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { baseURL } from "../../config";
import { User } from "../../types/user";
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { getUsers } from "../../services/getUsers";
import CardsUsers from "./CardsUsers";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Alert,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/app/store/hooks";
import { validateEmail, validatePhone } from "@/app/store/Slices/admindSlice";
import NoResults from "@/app/components/NoResults";
import { CharacterCounter } from "@/app/components/CharacterCounter";
interface userCreate {
  name: string
  middle_name: string
  last_name: string
  email: string
  birthdate: Date | string
  phone: number | string
}
interface validation {
  error: boolean
  message: string
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [validationEmail, setValidationEmail] = useState<validation>({
    error: false,
    message: ""
  });
  const [validationPhone, setValidationPhone] = useState<validation>({
    error: false,
    message: ""
  });
  const [userCreate, setUserCreate] = useState<userCreate>({
    name: "",
    middle_name: "",
    last_name: "",
    email: "",
    birthdate: "",
    phone: ""
  })
  const dispatch = useAppDispatch();
  const effectRan = useRef(false);
  // 2. Effect para cargar datos al montar
  useEffect(() => {
    if (!effectRan.current) {
      effectRan.current = true;
      getUsers().then((data) => {
        setUsers(data || []);
      })
    }
  }, []);


  const createUser = async () => {
    try {
      const response = await axios.post(`${baseURL}user`, userCreate);
      if (response?.data.created) {
        Swal.fire({
          title: "Creado con exito",
          icon: 'success',
          timer: 1500
        });
        const updatedUsers = await getUsers();
        if (updatedUsers) {
          setUsers(updatedUsers);
        }
        return false;
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        Swal.fire({
          title: "Error",
          icon: 'error',
          text: error.response.data?.message || "Ocurrió un error en el servidor",
          timer: 2500
        });
        console.error(error.response.data);
      }
    }
  }

  const userValidationSchema = Yup.object().shape({
    name: Yup.string().required("Este campoo es requerido"),
    last_name: Yup.string().required("Este campoo es requerido"),
    email: Yup.string().email("Correo inválido").required("Este campoo es requerido"),
    phone: Yup.string().required("Este campoo es requerido"),
    birthdate: Yup.string().required("Este campoo es requerido"),
  });
  const formik = useFormik<userCreate>({
    initialValues: {
      name: userCreate.name || "",
      middle_name: userCreate.middle_name || "",
      last_name: userCreate.last_name || "",
      email: userCreate.email || "",
      birthdate: userCreate.birthdate || "",
      phone: userCreate.phone || "",
    },
    enableReinitialize: true, // ✅ Reemplaza al useEffect para actualizar valores
    validationSchema: userValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      const validationEmail = await dispatch(validateEmail(values.email));
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
      // Pasa los valores validados directamente a createUser
      await createUser();
      setValidationEmail({
        error: false,
        message: ""
      });
      resetForm(); // Limpia el formulario de Formik
    },
  });
  return (
    <>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 12, lg: 4 }}>
          <Card
            component="form"
            autoComplete="off"
            onSubmit={formik.handleSubmit}
            sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom sx={{ textAlign: "center", fontSize: 18 }}>
                Crear Usuario
              </Typography>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <TextField
                    id="name"
                    label="Nombre"
                    variant="outlined"
                    fullWidth
                    value={userCreate.name}
                    onChange={(e) =>
                      setUserCreate((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
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
                    value={userCreate.middle_name}
                    onChange={(e) => {
                      setUserCreate((prev) => ({
                        ...prev,
                        middle_name: e.target.value
                      }))
                    }}
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
                    value={userCreate.last_name}
                    onChange={(e) => {
                      setUserCreate((prev) => ({
                        ...prev,
                        last_name: e.target.value
                      }))
                    }}
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
                    value={userCreate.email}
                    onChange={(e) => {
                      setUserCreate((prev) => ({
                        ...prev,
                        email: e.target.value
                      }))
                    }}
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
                  <TextField
                    id="phone"
                    label="Telefono"
                    variant="outlined"
                    fullWidth
                    type="text"
                    value={userCreate.phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*$/.test(val) && val.length <= 10) {
                        setUserCreate((prev) => ({
                          ...prev,
                          phone: val
                        }));
                      }
                    }}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    slotProps={{
                      htmlInput: {
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        maxLength: 10
                      },
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
                    id="birthdate"
                    label="Fecha de nacimiento"
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                    variant="outlined"
                    fullWidth
                    type="date"
                    value={userCreate.birthdate}
                    onChange={(e) => {
                      setUserCreate((prev) => ({
                        ...prev,
                        birthdate: e.target.value
                      }))
                    }}
                    error={formik.touched.birthdate && Boolean(formik.errors.birthdate)}
                    helperText={formik.touched.birthdate && formik.errors.birthdate}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button type="submit" variant="contained" fullWidth>
                Guardar
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid size={{ sm: 12, md: 12, lg: 8 }}>
          <main>
            {users.length ?
              <CardsUsers users={users || []}
                setUsers={setUsers} />
              :
              <NoResults message="No hay Usuarios por mostrar" />
            }
          </main>
        </Grid>
      </Grid>

    </>
  );
}
