import { admindListType } from "@/app/types/admind";
import { Avatar, Box, Button, Card, CardContent, Chip, Grid, Tooltip, Typography } from "@mui/material";
import BadgeIcon from '@mui/icons-material/Badge';
import ClipboardButton from "../../components/ClipboardButton"
import Link from "next/link";
interface AdmindListProps {
  adminds: admindListType[];
}
function AdmindList({ adminds }: AdmindListProps) {
  return (
    <>
      <Grid container spacing={2}>
        {!adminds.length ? <></> : <>
          {adminds.map((item) => (
            <Grid key={item.id_user} size={{ sm: 12, lg: 4 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    transform: 'translateY(-3px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Encabezado: Avatar con ícono + Chip */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.50',
                        color: 'primary.main',
                        width: 44,
                        height: 44,
                        borderRadius: 3
                      }}
                    >
                      <BadgeIcon />
                    </Avatar>

                    <Chip
                      label={`${item.user_type}`}
                      size="small"
                      sx={{
                        fontWeight: 800,
                        bgcolor: 'grey.100',
                        color: 'text.secondary',
                        fontSize: 14
                      }}
                    />
                  </Box>

                  {/* Nombre del Elemento */}
                  <Typography
                    variant="subtitle1"
                    color="text.primary"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: 42
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <Typography
                      variant="subtitle1"
                      color="text.primary"
                      sx={{
                        fontWeight: 700,
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: "ellipsis",
                        // Si quieres asegurarte que ocupe el espacio correcto sin estirarse de más:
                        flex: 1,
                        mr: 1 // Pequeño margen derecho para que no pegue con el botón
                      }}
                    >
                      {item.email}
                    </Typography>

                    <ClipboardButton text={item.email} />
                  </Box>

                  {/* Separador sutil */}
                  <Box sx={{ my: 2, height: '1px', bgcolor: 'divider' }} />
                  <Tooltip title="Editar">
                    <Link style={{ textDecoration: 'none' }} href={`/admind/${item.id_user}`}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="warning"
                      >
                        Editar
                      </Button>
                    </Link>
                  </Tooltip>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </>}
      </Grid>
    </>
  )
}
export default AdmindList;