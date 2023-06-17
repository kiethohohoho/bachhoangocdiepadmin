import { useEffect, useRef, useState } from 'react';
// @mui
import { Box } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { getImages } from 'src/api/ortherEcom';
// utils
import { bgGradient } from '../../../../utils/cssStyles';
// @types
// components
import Carousel, { CarouselArrowIndex } from '../../../../components/carousel';
import Image from '../../../../components/image';
import Lightbox from '../../../../components/lightbox';


// ----------------------------------------------------------------------

const THUMB_SIZE = 64;

type StyledThumbnailsContainerProps = {
  length: number;
};

const StyledThumbnailsContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'length',
})<StyledThumbnailsContainerProps>(({ length, theme }) => ({
  margin: theme.spacing(0, 'auto'),
  position: 'relative',

  '& .slick-slide': {
    opacity: 0.48,
    '&.slick-current': {
      opacity: 1,
    },
    '& > div': {
      padding: theme.spacing(0, 0.75),
    },
  },

  ...(length === 1 && {
    maxWidth: THUMB_SIZE * 1 + 16,
  }),
  ...(length === 2 && {
    maxWidth: THUMB_SIZE * 2 + 32,
  }),
  ...((length === 3 || length === 4) && {
    maxWidth: THUMB_SIZE * 3 + 48,
  }),
  ...(length >= 5 && {
    maxWidth: THUMB_SIZE * 6,
  }),
  ...(length > 2 && {
    '&:before, &:after': {
      ...bgGradient({
        direction: 'to left',
        startColor: `${alpha(theme.palette.background.default, 0)} 0%`,
        endColor: `${theme.palette.background.default} 100%`,
      }),
      top: 0,
      zIndex: 9,
      content: "''",
      height: '100%',
      position: 'absolute',
      width: (THUMB_SIZE * 2) / 3,
    },
    '&:after': {
      right: 0,
      transform: 'scaleX(-1)',
    },
  }),
}));

// ----------------------------------------------------------------------

export default function ProductDetailsCarousel({ productId }: any) {
  const theme = useTheme();

  const carousel1 = useRef<Carousel | null>(null);

  const carousel2 = useRef<Carousel | null>(null);

  const [nav1, setNav1] = useState<Carousel>();

  const [nav2, setNav2] = useState<Carousel>();

  const [currentIndex, setCurrentIndex] = useState<number>(1);

  const [selectedImage, setSelectedImage] = useState<number>(-1);

  const [images, setImages] = useState<any>([]);

  const imagesLightbox = images?.map((img:any) => ({ src: img.OriginalImageUrl }));

  useEffect(()=>{
    getImages(productId).then((res)=>{
      if(res?.data?.success===true){
        setImages(res?.data?.image);
      }
    })
  },[setImages, productId])

  const handleOpenLightbox = (imageUrl: string) => {
    const imageIndex = imagesLightbox.findIndex((image:any) => image.src === imageUrl);
    setSelectedImage(imageIndex);
  };

  const handleCloseLightbox = () => {
    setSelectedImage(-1);
  };

  const carouselSettings1 = {
    dots: false,
    arrows: false,
    slidesToShow: 1,
    draggable: false,
    slidesToScroll: 1,
    adaptiveHeight: true,
    beforeChange: (current: number, next: number) => setCurrentIndex(next),
  };

  const carouselSettings2 = {
    dots: false,
    arrows: false,
    centerMode: true,
    swipeToSlide: true,
    focusOnSelect: true,
    variableWidth: true,
    centerPadding: '0px',
    slidesToShow: images.length > 3 ? 3 : images.length,
  };

  useEffect(() => {
    if (carousel1.current) {
      setNav1(carousel1.current);
    }
    if (carousel2.current) {
      setNav2(carousel2.current);
    }
  }, []);

  useEffect(() => {
    carousel1.current?.slickGoTo(currentIndex);
  }, [currentIndex]);

  const handlePrev = () => {
    carousel2.current?.slickPrev();
  };

  const handleNext = () => {
    carousel2.current?.slickNext();
  };

  const renderLargeImg = (
    <Box sx={{ mb: 3, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
      <Carousel {...carouselSettings1} asNavFor={nav2} ref={carousel1}>
        {images.map((img:any) => (
          <Image
            key={img.Id}
            alt="product"
            src={img.OriginalImageUrl}
            ratio="1/1"
            onClick={() => handleOpenLightbox(img.OriginalImageUrl)}
            sx={{ cursor: 'zoom-in', minWidth: 539 }}
          />
        ))}
      </Carousel>

      <CarouselArrowIndex
        index={currentIndex}
        total={images.length}
        onNext={handleNext}
        onPrevious={handlePrev}
      />
    </Box>
  );

  const renderThumbnails = (
    <StyledThumbnailsContainer length={images.length}>
      <Carousel {...carouselSettings2} asNavFor={nav1} ref={carousel2}>
        {images.map((img:any, index:number) => (
          <Image
            key={img.Id}
            disabledEffect
            alt="thumbnail"
            src={img.OriginalImageUrl}
            sx={{
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: 1.5,
              cursor: 'pointer',
              ...(currentIndex === index && {
                border: `solid 2px ${theme.palette.primary.main}`,
              }),
            }}
          />
        ))}
      </Carousel>
    </StyledThumbnailsContainer>
  );

  return (
    <>
      <Box
        sx={{
          '& .slick-slide': {
            float: theme.direction === 'rtl' ? 'right' : 'left',
          },
        }}
      >
        {renderLargeImg}

        {renderThumbnails}
      </Box>

      <Lightbox
        index={selectedImage}
        slides={imagesLightbox}
        open={selectedImage >= 0}
        close={handleCloseLightbox}
        onGetCurrentIndex={(index) => setCurrentIndex(index)}
      />
    </>
  );
}
