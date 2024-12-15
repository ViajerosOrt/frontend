import { BackButton } from "@/components/BackButton/BackButton";
import { SmallTravelDetails } from "@/components/Travel/SmallTravelDetails/SmallTravelDetails";
import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { BOLD, VIAJERO_GREEN } from "@/consts";
import { Travel, useReviewQuery, useUpdateReviewMutation, useUserByIdQuery } from "@/graphql/__generated__/gql";

import { useAuth } from "@/hooks/useAth";
import { Button, Container, Paper, Rating, Select, Stack, Switch, Text, Textarea, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UpdateReview() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const reviewId = router.query.reviewId as string;

  const [isUserReview, setIsUserReview] = useState(false);

  const [updateReview] = useUpdateReviewMutation({
    refetchQueries: ["userById"]
  });

  const { data, loading } = useReviewQuery({
    variables: { reviewId: reviewId || '' },
    skip: !reviewId
  });

  const review = data?.review;

  const selectedTravel = review?.travel;
  const participants = selectedTravel?.usersTravelers?.filter(user => user.id !== currentUser?.id) || [];

  const participantOptions = participants.map(user => ({
    value: user.id,
    label: `${user.name}`
  }));

  const form = useForm({
    initialValues: {
      content: review?.content || '',
      stars: review?.stars || 0,
      receiverId: review?.receivedUserBy?.id || '',
    },
    validate: {
      content: (value) => (value.length < 10 ? 'Review must be at least 10 characters long' : null),
      stars: (value) => (value === 0 ? 'Please rate the travel' : null),
      receiverId: (value) => (isUserReview && !value ? 'Please select a participant' : null),
    },
  });

  useEffect(() => {
    if (review?.type === 'USER') {
      setIsUserReview(true);
    }

    if (review) {
      form.setValues({
        content: review.content || '',
        stars: review.stars || 0,
        receiverId: review.receivedUserBy?.id || '',
      });
    }
  }, [review]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await updateReview({
        variables: {
          id: reviewId,
          updateReviewInput: {
            content: values.content,
            stars: String(values.stars),
          }
        },
      });
      showNotification({
        message: 'Review updated successfully',
        color: 'green',
      });
      router.push('/reviews');
    } catch (error) {
      showNotification({
        message: 'Error updating review',
        color: 'red',
      });
    }
  };

  if (loading) {
    return <ViajeroLoader />;
  }

  return (
    <Container size="xl" mt="xl">
      <BackButton />
      <Title order={2} size={32} ta="center" fw={BOLD} mb={40}>
        Update Review
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
                disabled
                color={VIAJERO_GREEN}
                checked={isUserReview}
                onChange={(event) => {
                  setIsUserReview(event.currentTarget.checked);
                  form.setFieldValue('receiverId', '');
                }}
              />

              {isUserReview && (
                <Select
                  disabled
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
