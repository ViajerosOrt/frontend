import { BackButton } from "@/components/BackButton/BackButton";
import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { BOLD, VIAJERO_GREEN } from "@/consts";
import { Travel, useCreateReviewMutation, useUserByIdQuery } from "@/graphql/__generated__/gql";
import { useAuth } from "@/hooks/useAth";
import { Container, Title, Paper, Stack, Text, Rating, Textarea, Button, Switch, Select } from "@mantine/core";
import { useRouter } from "next/router";
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useState } from "react";

export default function Review() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const travelId = router.query.travelId as string;

  const [isUserReview, setIsUserReview] = useState(false);

  const [createReview] = useCreateReviewMutation({
    refetchQueries: ["userById"]
  });

  const { data, loading } = useUserByIdQuery({
    variables: { userByIdId: currentUser?.id || '' },
    skip: !currentUser?.id
  });

  const selectedTravel = data?.userById?.joinsTravels?.find(
    travel => travel.id === travelId
  );

  const participants = selectedTravel?.usersTravelers?.filter(user => user.id !== currentUser?.id) || [];

  const participantOptions = participants.map(user => ({
    value: user.id,
    label: `${user.name}`
  }));

  const form = useForm({
    initialValues: {
      content: '',
      stars: 0,
      receiverId: '',
    },
    validate: {
      content: (value) => (value.length < 10 ? 'Review must be at least 10 characters long' : null),
      stars: (value) => (value === 0 ? 'Please rate the travel' : null),
      receiverId: (value) => (isUserReview && !value ? 'Please select a participant' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await createReview({
        variables: {
          createReviewInput: {
            content: values.content,
            stars: values.stars,
          },
          travelId: travelId,
          userReceiverId: isUserReview ? values.receiverId : '',
        },
      });
      showNotification({
        message: 'Review submitted successfully',
        color: 'green',
      });
      router.push('/reviews');
    } catch (error) {
      showNotification({
        message: 'Error submitting review',
        color: 'red',
      });
    }
  };

  if (loading) {
    return <ViajeroLoader />;
  }

  if (!selectedTravel) {
    return <div>Travel not found</div>;
  }

  return (
    <Container size="xl" mt="xl">
      <BackButton />
      <Title order={2} size={32} mb={20} ta="center" fw={BOLD}>
        Review for {selectedTravel.travelTitle}
      </Title>

      <Paper shadow="md" radius="md" p="xl" withBorder>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="xl">
            <Stack gap={4}>
              <Text size="lg" fw={BOLD}>Rating</Text>
              <Text size="sm" c="dimmed">How would you rate your experience?</Text>
              <Rating
                size="xl"
                count={5}
                {...form.getInputProps('stars')}
              />
            </Stack>

            <Stack gap={4}>
              <Switch
                label="Review a participant"
                color={VIAJERO_GREEN}
                checked={isUserReview}
                onChange={(event) => {
                  setIsUserReview(event.currentTarget.checked);
                  form.setFieldValue('receiverId', '');
                }}
              />

              {isUserReview && (
                <Select
                  mt={12}
                  label="Select participant"
                  placeholder="Choose a participant to review"
                  data={participantOptions}
                  {...form.getInputProps('receiverId')}
                />
              )}
            </Stack>

            <Stack gap={4}>
              <Text size="lg" fw={BOLD}>Review</Text>
              <Text size="sm" c="dimmed">Share your experience with other travelers</Text>
              <Textarea
                placeholder="Write your review here..."
                rows={10}
                {...form.getInputProps('content')}
              />
            </Stack>

            <Button
              type="submit"
              color={VIAJERO_GREEN}
              size="lg"
              fullWidth
            >
              {isUserReview ? `Submit Review for participant` : 'Submit Review for the travel'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
