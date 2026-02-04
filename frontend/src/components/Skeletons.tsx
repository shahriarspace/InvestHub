import React from 'react';
import { Skeleton, Card, CardContent, Box, Grid } from '@mui/material';

// Skeleton for a startup/investor card
export const CardSkeleton: React.FC = () => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Skeleton variant="rounded" width={80} height={24} />
        <Skeleton variant="rounded" width={60} height={24} />
      </Box>
      <Skeleton variant="text" width="70%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
      <Skeleton variant="rounded" width="100%" height={8} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton variant="text" width={80} />
        <Skeleton variant="text" width={80} />
      </Box>
    </CardContent>
  </Card>
);

// Grid of card skeletons
interface CardGridSkeletonProps {
  count?: number;
  columns?: { xs: number; sm?: number; md?: number; lg?: number };
}

export const CardGridSkeleton: React.FC<CardGridSkeletonProps> = ({
  count = 6,
  columns = { xs: 12, sm: 6, md: 4 },
}) => (
  <Grid container spacing={3}>
    {Array.from({ length: count }).map((_, index) => (
      <Grid item key={index} {...columns}>
        <CardSkeleton />
      </Grid>
    ))}
  </Grid>
);

// Skeleton for a list item
export const ListItemSkeleton: React.FC = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, px: 2 }}>
    <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
    <Box sx={{ flex: 1 }}>
      <Skeleton variant="text" width="60%" height={24} />
      <Skeleton variant="text" width="40%" height={20} />
    </Box>
  </Box>
);

// List of list item skeletons
interface ListSkeletonProps {
  count?: number;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({ count = 5 }) => (
  <Box>
    {Array.from({ length: count }).map((_, index) => (
      <ListItemSkeleton key={index} />
    ))}
  </Box>
);

// Skeleton for a detail page
export const DetailPageSkeleton: React.FC = () => (
  <Box>
    {/* Header */}
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width={120} height={24} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Skeleton variant="text" width={300} height={48} />
          <Skeleton variant="text" width={150} height={24} />
        </Box>
        <Skeleton variant="rounded" width={100} height={36} />
      </Box>
    </Box>

    <Grid container spacing={4}>
      {/* Main Content */}
      <Grid item xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Skeleton variant="text" width={100} height={28} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </CardContent>
        </Card>
      </Grid>

      {/* Sidebar */}
      <Grid item xs={12} md={4}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Skeleton variant="text" width={150} height={28} sx={{ mb: 2 }} />
            <Skeleton variant="rounded" width="100%" height={10} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton variant="text" width={80} />
              <Skeleton variant="text" width={80} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

// Skeleton for a table row
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 5 }) => (
  <Box sx={{ display: 'flex', py: 2, borderBottom: 1, borderColor: 'divider' }}>
    {Array.from({ length: columns }).map((_, index) => (
      <Box key={index} sx={{ flex: 1, px: 2 }}>
        <Skeleton variant="text" width="80%" />
      </Box>
    ))}
  </Box>
);

// Table skeleton
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 5 }) => (
  <Box>
    {/* Header */}
    <Box sx={{ display: 'flex', py: 2, borderBottom: 2, borderColor: 'divider' }}>
      {Array.from({ length: columns }).map((_, index) => (
        <Box key={index} sx={{ flex: 1, px: 2 }}>
          <Skeleton variant="text" width="60%" height={24} />
        </Box>
      ))}
    </Box>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, index) => (
      <TableRowSkeleton key={index} columns={columns} />
    ))}
  </Box>
);

// Skeleton for stats cards
export const StatsCardSkeleton: React.FC = () => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
        <Box>
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={60} height={32} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Grid of stats card skeletons
export const StatsGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <Grid container spacing={3}>
    {Array.from({ length: count }).map((_, index) => (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <StatsCardSkeleton />
      </Grid>
    ))}
  </Grid>
);
