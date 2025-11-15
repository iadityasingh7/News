import { Box, CardContent, Skeleton, Stack, Grid } from "@mui/material";
import Card from "@mui/material/Card";

export const SkeletonCard = () => (
  <Card
    sx={{
      width: "100%",
      maxWidth: 360,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      borderRadius: 3,
      boxShadow: 3,
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    }}
  >
    <Box sx={{ flexGrow: 1 }}>
      <Skeleton 
        variant="rectangular" 
        height={180} 
        width={360}
        animation="wave"
        sx={{
          width: "100%",
          objectFit: "cover",
          backgroundColor: "grey.200",
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton 
          animation="wave" 
          height={28} 
          width="90%" 
          sx={{ mb: 0.5, lineHeight: 1.3 }} 
        />
        <Skeleton 
          animation="wave" 
          height={20} 
          width="70%" 
          sx={{ mb: 2 }} 
        />
        <Skeleton 
          animation="wave" 
          height={18} 
          width="100%" 
        />
        <Skeleton 
          animation="wave" 
          height={18} 
          width="85%" 
          sx={{ mt: 0.5 }} 
        />
      </CardContent>
    </Box>
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ p: 2, pt: 0 }}
    >
      <Skeleton animation="wave" width={80} height={20} />
      <Skeleton variant="circular" width={32} height={32} />
    </Stack>
  </Card>
);


export const SkeletonCardGrid = ({ rows = 3 }) => {
  const cardsPerRow = 3;
  const totalCards = rows * cardsPerRow;

  return (
    <Box>
      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
        {Array.from(new Array(totalCards)).map((_, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={index}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <SkeletonCard />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
