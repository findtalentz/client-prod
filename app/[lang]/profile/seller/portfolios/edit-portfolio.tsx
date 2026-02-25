"use client";
import { queryClient } from "@/app/[lang]/query-client-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { storage } from "@/firebase";
import Portfolio from "@/schemas/Portfolio";
import apiClient from "@/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid } from "@radix-ui/themes";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import { z } from "zod";

const portfolioFormSchema = z
  .object({
    title: z
      .string()
      .min(1, "Please enter a project title")
      .max(100, "Title should be less than 100 characters")
      .regex(/^[a-zA-Z0-9\s\-_,.!'()]+$/, "Title contains invalid characters"),

    role: z
      .string()
      .min(1, "Please specify your role in the project")
      .max(50, "Role description should be less than 50 characters"),

    description: z
      .string()
      .min(30, "Description should be at least 30 characters long")
      .max(10000, "Description should be less than 10000 characters")
      .refine(
        (val) => val.trim().split(/\s+/).length >= 10,
        "Description should contain at least 10 words"
      ),
  })
  .refine(
    (data) => {
      // Custom validation example: title and description shouldn't be the same
      return (
        data.title.trim().toLowerCase() !==
        data.description.trim().toLowerCase()
      );
    },
    {
      message: "Description should be different from the title",
      path: ["description"],
    }
  );

type PortfolioFormValues = z.infer<typeof portfolioFormSchema>;

interface Props {
  portfolio: Portfolio;
}

export function EditPortfolio({ portfolio }: Props) {
  const [open, setOpen] = useState(false);
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState<string[]>(portfolio.skills);
  const [image, setImage] = useState(portfolio.thumbnail);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      title: portfolio.title,
      role: portfolio.role,
      description: portfolio.description,
    },
  });
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const storageRef = ref(storage, `portfolio/${Date.now()}`);
      await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setImage(downloadURL);
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: PortfolioFormValues) => {
    try {
      const portfolioData = {
        ...data,
        skills,
        image,
      };

      await apiClient.put(`/portfolios/${portfolio._id}`, portfolioData);
      form.reset();
      setSkills([]);
      setImage("");
      toast.success("Portfolio added successfully!");
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      setOpen(false);
    } catch (error) {
      toast.error("Failed to add portfolio");
      console.error("Submission error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({ variant: "ghost", size: "sm" })}
      >
        <FaRegEdit className="text-gray-600 hover:text-gray-900" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[calc(100vw-80px)]">
        <DialogHeader>
          <DialogTitle>Edit Education</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Grid columns="2" style={{ gap: "30px" }}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. E-commerce Website"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your role (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Frontend Developer"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel className="mb-3">
                    Skills and deliverables
                  </FormLabel>
                  <Input
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (!skill.trim()) {
                          toast.error("Please enter a skill");
                          return;
                        }
                        setSkills([...skills, skill.trim()]);
                        setSkill("");
                      }
                    }}
                    type="text"
                    placeholder="Add skills (press Enter)"
                  />
                  <div className="flex gap-3 py-3">
                    {skills.map((skill, i) => (
                      <Button variant="light" size="sm" key={i}>
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your project in detail"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col h-full">
                <div className="h-[450px]">
                  <FormLabel htmlFor="portfolio-image" className="mb-3">
                    Media
                  </FormLabel>
                  <div className="h-full border-primary border-2 border-dashed rounded-2xl flex items-center justify-center relative">
                    <input
                      onChange={handleImageUpload}
                      id="portfolio-image"
                      className="w-full h-full opacity-0 absolute top-0 left-0 cursor-pointer"
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                    />
                    {image ? (
                      <div className="w-full h-full p-2">
                        <Image
                          src={image}
                          alt="Preview"
                          width={500}
                          height={300}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1">
                        {isUploading ? (
                          <BeatLoader size={8} />
                        ) : (
                          <>
                            <Text>
                              <span className="text-primary">Upload </span>image
                              or Drag and Drop here
                            </Text>
                            <Text
                              variant="gray"
                              className="text-gray-400"
                              size="small"
                            >
                              (JPG, PNG formats, up to 50MB)
                            </Text>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Grid>

            <DialogFooter className="mt-16">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isUploading}
              >
                {form.formState.isSubmitting ? (
                  <BeatLoader />
                ) : (
                  "Update Portfolio"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
