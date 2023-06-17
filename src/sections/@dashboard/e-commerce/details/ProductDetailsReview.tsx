import sumBy from 'lodash/sumBy';
import { useState } from 'react';
// @mui
import { Box, Button, Divider, LinearProgress, Rating, Stack, Typography } from '@mui/material';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';
// @types
import { IRating, IReviewState } from '../../../../@types/product';
// components
import Iconify from '../../../../components/iconify';
//
import ProductDetailsReviewNewDialog from './ProductDetailsNewReviewForm';
import ProductDetailsReviewList from './ProductDetailsReviewList';

// ----------------------------------------------------------------------

type Props = {
  reviewsdata?: IReviewState;
};

export default function ProductDetailsReview({ reviewsdata }: Props) {
  // const { reviews, ratings } = reviewsdata;

  const [openReview, setOpenReview] = useState(false);

  const handleOpenReview = () => {
    setOpenReview(true);
  };

  const handleCloseReview = () => {
    setOpenReview(false);
  };

  const calculate = (): number => {
    let totalRating: number = 0;
    const countReviews = reviewsdata?.reviews ? reviewsdata?.reviews?.length : 0;
    reviewsdata?.reviews?.map((e: any) => {
      totalRating += Number(e.Rate);
      return totalRating;
    });
    return Math.round((totalRating / countReviews) * 10) / 10;
  };
  const total = sumBy(reviewsdata?.ratings, (star) => star.reviewCount);

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        sx={{
          paddingTop: 2,
          paddingBottom: 2,
        }}
      >
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={1}
          sx={{
            pt: { xs: 5, md: 0 },
            pb: { xs: 3, md: 0 },
          }}
        >
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Xếp hạng trung bình
          </Typography>
          {Number.isNaN(calculate()) ? (
            <Typography variant="h6">Chưa có đánh giá</Typography>
          ) : (
            <>
              <Typography variant="h2">{calculate()}/5</Typography>

              <Rating readOnly value={calculate()} precision={0.1} />

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                ({fShortenNumber(reviewsdata?.reviews ? reviewsdata?.reviews?.length : 0)} đánh giá)
              </Typography>
            </>
          )}
        </Stack>

        <Stack
          spacing={1.5}
          sx={{
            p: 3,
            py: { md: 5 },
            borderLeft: (theme) => ({ md: `dashed 1px ${theme.palette.divider}` }),
            borderRight: (theme) => ({ md: `dashed 1px ${theme.palette.divider}` }),
          }}
        >
          {reviewsdata?.ratings
            .slice(0)
            .reverse()
            .map((rating) => (
              <ProgressItem key={rating.name} star={rating} total={total} />
            ))}
        </Stack>

        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            pt: { xs: 3, md: 0 },
            pb: { xs: 5, md: 0 },
          }}
        >
          <Button
            color="inherit"
            size="large"
            onClick={handleOpenReview}
            variant="outlined"
            startIcon={<Iconify icon="eva:edit-fill" />}
          >
            Viết đánh giá
          </Button>
        </Stack>
      </Box>

      <Divider />
      {reviewsdata?.reviews && <ProductDetailsReviewList reviews={reviewsdata?.reviews} />}

      <ProductDetailsReviewNewDialog open={openReview} onClose={handleCloseReview} />
    </>
  );
}

// ----------------------------------------------------------------------

type ProgressItemProps = {
  star: IRating;
  total: number;
};

function ProgressItem({ star, total }: ProgressItemProps) {
  const { name, reviewCount } = star;

  return (
    <Stack direction="row" alignItems="center">
      <Typography variant="subtitle2" sx={{ width: 50 }}>
        {name}
      </Typography>

      <LinearProgress
        color="inherit"
        variant="determinate"
        value={(reviewCount / total) * 100}
        sx={{
          mx: 2,
          flexGrow: 1,
        }}
      />

      <Typography
        variant="body2"
        sx={{
          minWidth: 48,
          color: 'text.secondary',
        }}
      >
        {fShortenNumber(reviewCount)}
      </Typography>
    </Stack>
  );
}
