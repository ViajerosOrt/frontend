import { useForm, zodResolver } from "@mantine/form";
import { BackButton } from "@/components/BackButton/BackButton";
import { BOLD, VIAJERO_GREEN } from "@/consts";
import { useGetAllActivitiesQuery, User, useUpdateMutation } from "@/graphql/__generated__/gql";
import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  FileButton,
  FileInput,
  Group,
  Loader,
  MultiSelect,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { CgProfile } from "react-icons/cg";
import { z } from "zod";
import { DatePickerInput } from "@mantine/dates";
import { showNotification } from '@mantine/notifications';
import { useRouter } from "next/router";
import { USER_MAX_DESCRIPTION_LENGHT, USER_MAX_NAME_LENGHT } from "@/consts/validators";
import { useState } from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { Countries } from "../MapComponents/Countries";
import { useAuth } from "@/hooks/useAth";
import { AiOutlineCloudUpload } from "react-icons/ai";

type UserEditFormProps = {
  user: User
}

const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  description: z.string().max(200).optional(),
  birthDate: z.date().refine(
    (date) => {
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      const isOld =
        today.getMonth() > date.getMonth() ||
        (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());
      return age > 18 || (age === 18 && isOld);
    },
    {
      message: 'You must be at least 18 years old.',
    }
  ),
});

export const UserEditForm = ({ user }: UserEditFormProps) => {
  const router = useRouter()
  const activitiesIds = user?.userActivities?.map(({ id }) => id) || [];
  const [selectedActivitiesIds, setSelectedActivitiesIds] = useState<string[]>(activitiesIds);

  const { data } = useGetAllActivitiesQuery();
  const activities = data?.activities || [];

  const [file, setFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useAuth()
  const handleImageUpload = (selectedFile: File | null) => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
    setFile(selectedFile);
  };


  const form = useForm({
    initialValues: {
      name: user.name,
      email: user.email,
      password: user.password,
      description: user.description || '',
      birthDate: new Date(user.birthDate),
      activitiesIds: activitiesIds || [],
      whatsapp: user.whatsapp || '',
      instagram: user.instagram || '',
      country: user.country || '',
      userImage: '',
    },
    validate: zodResolver(userSchema),
  });

  const [updateUser] = useUpdateMutation({ refetchQueries: ["User"] })

  const handleCountryChange = (val: string | null) => {
    form.setFieldValue('country', val!)
  };

  const handleUpdateUser = async () => {
    const values = { ...form.values, activitiesIds: selectedActivitiesIds };
    setIsLoading(true);
    let uploadedImageUrl = null;

    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_GRAPHQL_API!, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          console.log('Error');
          throw new Error('Failed to upload image');
        }

        const uploadResult = await uploadResponse.json();
        uploadedImageUrl = uploadResult.url;
        values.userImage = uploadedImageUrl;
        currentUser!.userImage! = uploadedImageUrl!;
      } catch (error) {
        console.log('Upload error details:', error);
        showNotification({
          message: `Error uploading image: ${error}`,
          color: 'red',
        });
        return;
      }
    }

    try {
      await updateUser({
        variables: {
          updateUserInput: values
        }
      });
      showNotification({ message: 'Profile updated successfully', color: 'green' });
      setSelectedActivitiesIds([])
      form.reset();
      router.back()
    } catch (error: any) {
      showNotification({ message: error.message ? error.message : 'Error updating your profile', color: 'red' });
    } finally {
      setIsLoading(false);
    }

  }

  return (
    <Container mt="xl" ta="left" w="100%" >
      <Group align="center" w="100%">
        <BackButton />
        <Box style={{ flex: 1, textAlign: 'center' }}>
          <Title mb="lg">Your Profile</Title>
        </Box>
      </Group>
      <Paper p="md" withBorder shadow="md">
        <form onSubmit={form.onSubmit(handleUpdateUser)}>
          <Stack gap="lg" w="100%">
            <Center >
              <Avatar
                src={uploadedImage || user.userImage}
                size={100}
                radius="xl"
              />
            </Center>
            <Box>
              <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}> Name </Text>
              <Text size="sm" c="gray">Your user name.</Text>
              <TextInput mt={10} {...form.getInputProps('name')} required />
              <Group justify="space-between" mt={10} ml={6}>
                <Text
                  size="xs"
                  c={
                    (form.values.name?.length || 0) >
                      USER_MAX_NAME_LENGHT
                      ? 'red'
                      : 'gray'
                  }
                  ta="start"
                  w="100%"
                >
                  {form.values.name?.length || 0} /{' '}
                  {USER_MAX_NAME_LENGHT}
                </Text>
              </Group>
            </Box>
            <Box>
              <Text fw={BOLD} style={{ fontSize: '1.5rem' }}> Description </Text>
              <Text size="sm" c="gray">Your description.</Text>
              <TextInput mt={10}{...form.getInputProps('description')} />
              <Group justify="space-between" mt={10} ml={6}>
                <Text
                  size="xs"
                  c={
                    (form.values.description?.length || 0) >
                      USER_MAX_DESCRIPTION_LENGHT
                      ? 'red'
                      : 'gray'
                  }
                  ta="start"
                  w="100%"
                >
                  {form.values.description?.length || 0} /{' '}
                  {USER_MAX_DESCRIPTION_LENGHT}
                </Text>
              </Group>
            </Box>
            <Stack gap={4}>
              <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Image</Text>
              <Text size="sm" c="gray">Upload an image for your travel!</Text>
              <FileInput
                accept="image/*"
                onChange={handleImageUpload}
                leftSection={<AiOutlineCloudUpload size={20} />}
                placeholder="Upload image"
                radius="md"
                size="sm"
                styles={{
                  input: {
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'var(--mantine-color-blue-filled)'
                    }
                  },
                  section: {
                    color: 'var(--mantine-color-dimmed)',
                    '&:hover': {
                      color: 'var(--mantine-color-blue-filled)'
                    }
                  }
                }}
              />

            </Stack>
            <Box>
              <Text fw={BOLD} style={{ fontSize: '1.5rem' }}> Birth date </Text>
              <Text size="sm" c="gray">Your birthdate.</Text>
              <DatePickerInput mt={10} defaultDate={new Date(user.birthDate)}  {...form.getInputProps('birthDate')} />
            </Box>

            <Box>
              <Text fw={BOLD} style={{ fontSize: '1.5rem' }}> Country </Text>
              <Text size="sm" c="gray">Your country.</Text>
              <Countries
                value={form.values.country}
                disabled={false}
                onChange={handleCountryChange} defaultCountry={null} />
            </Box>

            <Box>
              <Text fw={BOLD} style={{ fontSize: '1.5rem' }}>Activities</Text>
              <Text size="sm" c="gray">A selection of your favorite activities.</Text>
              <MultiSelect
                mt={10}
                data={activities.map((
                  activity: { id: any; activityName: any; }) => ({
                    value: activity.id,
                    label: activity.activityName
                  }))}
                value={selectedActivitiesIds}
                placeholder="Select activites your favorite activities"
                onChange={setSelectedActivitiesIds}
                style={{ fontWeight: 700, fontSize: '1.5rem' }}
                comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
              />
            </Box>
            <Box>
              <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}> Social Networks </Text>
              <Text size="sm" c="gray">Your social networks so travelers can reach you.</Text>
              <Group mt={12}>
                <FaWhatsapp color="#25D366" className="h-6 w-6" />
                <PhoneInput defaultCountry="UY" {...form.getInputProps('whatsapp')} style={{
                  paddingTop: '5px',
                  paddingLeft: "10px",
                  paddingBottom: "5px",
                  marging: '10px',
                  border: '1px solid #ced4da', // Ensures the border is present
                  borderRadius: '5px',         // Optional: Add rounded corners
                }} />
              </Group>
              <Group mt={12}>
                <FaInstagram color="#E1306C" className="h-6 w-6" />
                <TextInput mt={10} w="30%" {...form.getInputProps('instagram')} placeholder="Your instagram account name" />
              </Group>
            </Box>
            <Button variant="filled" type="submit" color={VIAJERO_GREEN} fullWidth mt="md" radius="md" disabled={isLoading} leftSection={isLoading ?
              <Loader size="sm" color="blue" /> : null}>
              {isLoading ? 'Editing Profile...' : 'Edit Profile'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container >
  )
}