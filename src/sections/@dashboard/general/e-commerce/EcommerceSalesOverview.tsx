// @mui
import { Card, CardHeader, CardProps, LinearProgress, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
// utils
import { fPercent } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

type ItemProps = {
  allProductsCount: number;
  bestSellingProducts: {
    Name: string;
    ProductId: string;
    Total: number;
  }[];
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  data: ItemProps;
}

export default function EcommerceSalesOverview({ title, subheader, data, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={4} sx={{ p: 3 }}>
        {data.bestSellingProducts.map((progress, index) => (
          <ProgressItem
            key={progress?.ProductId}
            progress={progress}
            allProductsCount={data.allProductsCount}
            index={index}
          />
        ))}
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ProgressItemProps = {
  allProductsCount: number;
  index: number;
  progress: {
    Name: string;
    ProductId: string;
    Total: number;
  };
};

function ProgressItem({ progress, allProductsCount, index }: ProgressItemProps) {
  const renderPercent = useCallback(
    () => Math.round((progress.Total / allProductsCount) * 100 * 100) / 100,
    [progress, allProductsCount]
  );

  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          {progress?.Name}
        </Typography>
        <Typography variant="subtitle2">{progress.Total}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp;({fPercent(String(renderPercent()))})
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={renderPercent()}
        color={(index === 0 && 'primary') || (index === 1 && 'info') || 'warning'}
      />
    </Stack>
  );
}
