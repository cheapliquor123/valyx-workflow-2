import { Box, Skeleton, Paper, Grid } from "@mui/material";

const WorkflowSkeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* 1. Sidebar Skeleton */}
      <Paper
        elevation={3}
        sx={{
          width: 320,
          borderRight: "1px solid #ddd",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />

        {/* Mimic Categories */}
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ mt: 2 }}>
            <Skeleton variant="text" width="40%" height={30} sx={{ mb: 1 }} />
            <Skeleton
              variant="rectangular"
              height={50}
              sx={{ borderRadius: 1, mb: 1 }}
            />
            <Skeleton
              variant="rectangular"
              height={50}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        ))}
      </Paper>

      {/* 2. Canvas Area Skeleton */}
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: "#F5F5F5",
          position: "relative",
          p: 4,
        }}
      >
        {/* Toolbar */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
          <Skeleton
            variant="rectangular"
            width={150}
            height={40}
            sx={{ borderRadius: 1 }}
          />
        </Box>

        {/* Ghost Nodes scattered to mimic a graph */}
        <Grid container spacing={10} justifyContent="center" sx={{ mt: 4 }}>
          {/* Ghost Node 1 (Top) */}
          <Grid>
            <Skeleton
              variant="rectangular"
              width={300}
              height={180}
              sx={{ borderRadius: 2 }}
            />
          </Grid>

          {/* Ghost Node 2 (Middle) */}
          <Grid size="grow" sx={{ display: "flex", justifyContent: "center" }}>
            <Skeleton
              variant="rectangular"
              width={300}
              height={180}
              sx={{ borderRadius: 2 }}
            />
          </Grid>

          {/* Ghost Nodes 3 & 4 (Bottom Split) */}
          <Grid>
            <Skeleton
              variant="rectangular"
              width={300}
              height={180}
              sx={{ borderRadius: 2 }}
            />
          </Grid>
          <Grid>
            <Skeleton
              variant="rectangular"
              width={300}
              height={180}
              sx={{ borderRadius: 2 }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default WorkflowSkeleton;
