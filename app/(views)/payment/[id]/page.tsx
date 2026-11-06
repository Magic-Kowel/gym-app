"use client"
import { getUser } from "@/app/services/getUser";
import { User } from "@/app/types/user";
import { MembershipType } from "@/app/types/memberships";
import { useState, useEffect, use } from "react";
import { getMemberships } from "@/app/services/getMemberships";
import { Button, Card, CardContent, Container, Grid, Typography, Alert } from "@mui/material";
import SearchAutocomplete from "@/app/components/SearchAutocomplete";
import BackButton from "@/app/components/BackButton";
import Swal from "sweetalert2";
import axios from "axios";
import { baseURL } from "@/app/config";
import { useRouter } from "next/navigation";
interface PaymentUserProps {
    params: Promise<{ id: string }>;
}
interface PaymentType {
    userId: number
    membershipId: number
    price: number
}
function PaymentUser({ params }: PaymentUserProps) {
    const resolvedParams = use(params);
    const userId = Number(resolvedParams.id);
    const [user, setUser] = useState<User[]>([]);
    const [memberships, setMemberships] = useState<MembershipType[]>([]);
    const [membership, setMembership] = useState<MembershipType | null>(null);
    const [send, setSend] = useState<boolean>(false);
    const router = useRouter();
    useEffect(() => {
        getUser(userId).then((resquest) => {
            const userData = Array.isArray(resquest) ? resquest : [];
            if (userData) {
                setUser(userData);
            }
        });
        getMemberships().then((resquest) => {
            const membershipsData = Array.isArray(resquest) ? resquest : [];
            if (membershipsData) {
                setMemberships(membershipsData);
            }
        });
    }, [userId])
    const createPayment = async (data: PaymentType) => {
        try {
            const response = await axios.post(`${baseURL}payment`, data);
            if (response?.data.created) {
                await Swal.fire({
                    title: "Creado con exito",
                    icon: 'success',
                    timer: 1500
                });
            }
            router.back();
        } catch (error) {
            console.error("Error al crear usuarios:", error);
        }
    }
    const createMembership = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSend(true);
        if (!membership) {
            return;
        }
        const dataPayment = {
            userId: userId,
            membershipId: membership.id_membership,
            price: membership.price
        }
        createPayment(dataPayment);
    }
    return (<>

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
                        <form onSubmit={createMembership}>
                            <Grid container spacing={2}>
                                <Grid size={12}>
                                    <Typography sx={{ textAlign: "center" }} variant="body1" component="h2">
                                        {`${user[0]?.name} ${user[0]?.middle_name} ${user[0]?.last_name}`}
                                    </Typography>
                                </Grid>
                                <Grid size={12}>
                                    <SearchAutocomplete<MembershipType>
                                        data={memberships}
                                        getLabel={(option) =>
                                            `${option.name}`
                                        }
                                        optionsValues={(option, value) => option.name === value.name}
                                        onSelect={setMembership}
                                        label={"Buscar Membrecia"}
                                    />
                                    {send && membership === null && (
                                        <Alert severity="error" sx={{ width: "100%", justifyContent: "center" }}>
                                            La membresía es requerida
                                        </Alert>
                                    )}
                                </Grid>
                                <Grid size={12}>
                                    {
                                        membership?.price ? ` Costo ${membership?.price}` : ""
                                    }
                                </Grid>
                                <Grid size={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        disabled={send && membership === null}
                                    >
                                        Guardar
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>

                </Card>

            </Grid>
        </Container>
    </>);
}
export default PaymentUser;