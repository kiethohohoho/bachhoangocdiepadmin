import { m } from 'framer-motion';
import { useRef, useState } from 'react';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import { Box, Stack, Card, Button, Container, Typography, IconButton } from '@mui/material';
import _mock from 'src/_mock/_mock';
// _mock_
import { _carouselsMembers, _socials } from '../../_mock/arrays';
// components
import Image from '../../components/image';
import Iconify from '../../components/iconify';
import Carousel, { CarouselArrows } from '../../components/carousel';
import { MotionViewport, varFade } from '../../components/animate';


// ----------------------------------------------------------------------

export default function AboutTeam() {
  const carouselRef = useRef<Carousel>(null);

  const theme = useTheme();

  const [carouselsMembers, setCarouselsMembers] = useState<any>([
    {
      id: 'carouselsMembers1',
      name: 'Nguyễn Thị Ngọc Diệp',
      role: 'Chủ cửa hàng',
      avatar: `https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/269115550_129562132856515_3376605086516009922_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=DaBZmCsO34EAX-Idwt1&_nc_ht=scontent.fsgn2-9.fna&oh=00_AfBWkkqvWVw3356AYs5beUs0kXI3JiClyw778wOAEoCmiA&oe=64655566`,
    },
    {
      id: 'carouselsMembers2',
      name: 'Nguyễn Trọng Quí',
      role: 'Fontend Devoloper',
      avatar: `https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-6/309026690_806343060510705_3602952901876822903_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=Q-jMadV1vhsAX-HmEuu&_nc_ht=scontent.fsgn2-3.fna&oh=00_AfCWmQARlt_HpbGS246u0jKZWkDMh2fWLFJqfpP7iC5hZw&oe=6464C270`,
    },
    {
      id: 'carouselsMembers3',
      name: 'Lê Tấn Kiệt',
      role: 'Backend Devoloper',
      avatar: `https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/313970749_909537283765408_3978847381433871275_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=0debeb&_nc_ohc=3b8hX-B1RVcAX__DgqW&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAS27_CUsHB8crAn_EPtsm6ndDFfpPBj19r4Y2MqBa0SQ&oe=6465338B`,
    },
  ]);

  const carouselSettings = {
    infinite: false,
    arrows: false,
    slidesToShow: 4,
    rtl: Boolean(theme.direction === 'rtl'),
    responsive: [
      {
        breakpoint: 1279,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 959,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const handlePrev = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <Container component={MotionViewport} sx={{ pb: 10, textAlign: 'center' }}>
      <m.div variants={varFade().inDown}>
        <Typography component="p" variant="overline" sx={{ color: 'text.disabled' }}>
          Đội ngủ sáng lập
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography variant="h2" sx={{ my: 3 }}>
          Một đội ngủ năng động sáng tạo là chìa khóa
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography
          sx={{
            mx: 'auto',
            maxWidth: 640,
            color: 'text.secondary',
          }}
        >
          Bách hóa Ngọc Diệp sẻ luôn dỗi theo và hổ trợ bạn mội lúc mội nơi nếu bạn gặp khó khăn cần chúng tôi,
          chúng tối sẻ không ngừng nâng cấp để đem đến cho các bạn sự trải nghiệm mua hàng tốt nhất.
        </Typography>
      </m.div>

      <Box sx={{ position: 'relative' }}>
        <CarouselArrows
          filled
          shape="rounded"
          onNext={handleNext}
          onPrevious={handlePrev}
          leftButtonProps={{
            sx: {
              left: 24,
              ...(carouselsMembers.length < 5 && { display: 'none' }),
            },
          }}
          rightButtonProps={{
            sx: {
              right: 24,
              ...(carouselsMembers.length < 5 && { display: 'none' }),
            },
          }}
        >
          <Carousel ref={carouselRef} {...carouselSettings}>
            {carouselsMembers.map((member: any) => (
              <Box
                key={member.id}
                component={m.div}
                variants={varFade().in}
                sx={{ px: 1.5, py: 10 }}
              >
                <MemberCard member={member} />
              </Box>
            ))}
          </Carousel>
        </CarouselArrows>
      </Box>

      <Button
        variant="outlined"
        color="inherit"
        size="large"
        endIcon={<Iconify icon="ic:round-arrow-right-alt" width={24} />}
        sx={{ mx: 'auto' }}
      >
        View all team members
      </Button>
    </Container>
  );
}

// ----------------------------------------------------------------------

type MemberCardProps = {
  member: {
    name: string;
    role: string | undefined;
    avatar: string;
  };
};

function MemberCard({ member }: MemberCardProps) {
  const { name, role, avatar } = member;
  return (
    <Card key={name}>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 0.5 }}>
        {name}
      </Typography>

      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        {role}
      </Typography>

      <Box sx={{ px: 1 }}>
        <Image alt={name} src={avatar} ratio="1/1" sx={{ borderRadius: 2 }} />
      </Box>

      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ p: 2 }}>
        {_socials.map((social) => (
          <IconButton
            key={social.name}
            sx={{
              color: social.color,
              '&:hover': {
                bgcolor: alpha(social.color, 0.08),
              },
            }}
          >
            <Iconify icon={social.icon} />
          </IconButton>
        ))}
      </Stack>
    </Card>
  );
}
