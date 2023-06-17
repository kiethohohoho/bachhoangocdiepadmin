import { ApexOptions } from 'apexcharts';
import { useEffect } from 'react';
// @mui
import { Box, Card, CardProps, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
// utils
import { fNumber, fPercent } from '../../../../utils/formatNumber';
// components

import Chart, { useChart } from '../../../../components/chart';
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
  percent: number;
  chart: {
    colors?: string[];
    series: number[];
    options?: ApexOptions;
  };
}

export default function EcommerceWidgetSummary({
  title,
  percent,
  total,
  chart,
  sx,
  ...other
}: Props) {
  const { colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    chart: {
      animations: {
        enabled: true,
      },
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      width: 2,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (value: number) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
      marker: {
        show: false,
      },
    },
    ...options,
  });
  useEffect(() => {
    console.log('options: ', title, percent, total, chart);
  }, [title, percent, total, chart]);

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" paragraph>
          {title}
        </Typography>

        <Typography variant="h3" gutterBottom>
          {fNumber(total)}
        </Typography>

        <TrendingInfo percent={percent} />
      </Box>

      <Chart
        type="line"
        series={[{ data: series }]}
        options={chartOptions}
        width={120}
        height={80}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

type TrendingInfoProps = {
  percent: number;
};

function TrendingInfo({ percent }: TrendingInfoProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
      <Iconify
        icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'}
        sx={{
          mr: 1,
          p: 0.5,
          width: 24,
          height: 24,
          borderRadius: '50%',
          color: 'success.main',
          bgcolor: (theme) => alpha(theme.palette.success.main, 0.16),
          ...(percent < 0 && {
            color: 'error.main',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.16),
          }),
        }}
      />

      <Typography variant="subtitle2" component="div" noWrap>
        {percent > 0 && '+'}

        {fPercent(percent)}

        <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
          {' '}
          so với tuần trước
        </Box>
      </Typography>
    </Stack>
  );
}
