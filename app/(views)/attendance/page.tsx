"use client";

import { useState } from "react";
import { Box, TextField, Button, Card, CardContent, Typography, Avatar } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import PersonIcon from "@mui/icons-material/Person";
import { getUserbyphone } from "@/app/services/getUserbyphone";
import { baseURL } from "@/app/config";

// Tipado del usuario por teléfono
export interface UserByphoneType {
  id_user: number;
  name: string;
  middle_name: string;
  last_name: string;
  phone: number;
}

export default function AttendanceManager() {
  const [user, setUser] = useState<UserByphoneType | null>(null);
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);

    try {
      const numericPhone = Number(phone);
      const response = await getUserbyphone(numericPhone);

      if (!response) {
        await Swal.fire({
          title: "Usuario no encontrado",
          icon: "error",
        });
        setUser(null);
        return;
      }

      const userData: UserByphoneType = Array.isArray(response) ? response[0] : response;

      if (!userData?.id_user) {
        await Swal.fire({
          title: "Usuario no encontrado",
          icon: "error",
        });
        setUser(null);
        return;
      }

      // 1. Guardamos en el estado para mostrarlo en el render JSX
      setUser(userData);

      // 2. Pasamos userData directamente para evitar la asincronía de useState
      await handleCreateAttendance(userData);

    } catch (error) {
      console.error("Error al buscar usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAttendance = async (foundUser: UserByphoneType) => {
    const data = { idUser: foundUser.id_user };

    try {
      const response = await axios.post(`${baseURL}attendance`, data);

      if (response?.data?.created === false) {
        await Swal.fire({
          title: `No tiene membresía activa: ${foundUser.name}`,
          icon: "error",
          timer: 1500,
        });
        return;
      }

      if (response?.data?.created) {
        await Swal.fire({
          title: `¡Bienvenido: ${foundUser.name}!`,
          icon: "success",
          timer: 1500,
        });
        return;
      }

      if (response?.status === 200) {
        await Swal.fire({
          title: `Ya estás registrado por hoy: ${foundUser.name}`,
          icon: "info",
          timer: 1500,
        });
        return;
      }
    } catch (error) {
      console.error("Error al crear asistencia:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 2 }}>
      {/* Formulario de búsqueda por teléfono */}
      <Box component="form" onSubmit={handleUser} sx={{ display: "flex", gap: 1, mb: 3 }}>
        <TextField
          fullWidth
          label="Número de Teléfono"
          variant="outlined"
          value={phone}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) {
              setPhone(val);
            }
          }}
          type="number"
        />
        <Button variant="contained" type="submit" disabled={loading}>
          Buscar
        </Button>
      </Box>

      {/* Renderizado que UTILIZA el estado user */}
      {user && (
        <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16 }}>
                {user.name} {user.middle_name} {user.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tel: {phone}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}