"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { storage } from "@/firebase";
import Portfolio from "@/schemas/Portfolio";
import apiClient from "@/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Plus, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import rehypeSanitize from "rehype-sanitize";
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
  portfolio?: Portfolio;
  mode?: "create" | "edit";
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PortfolioForm({ portfolio, mode = "create", onCancel }: Props) {
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState<string[]>(portfolio?.skills || []);
  const [thumbnail, setThumbnail] = useState(portfolio?.thumbnail || "");
  const [images, setImages] = useState<string[]>(portfolio?.images || []);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const router = useRouter();

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      title: portfolio?.title || "",
      role: portfolio?.role || "",
      description: portfolio?.description || "",
    },
  });

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const storageRef = ref(
        storage,
        `portfolio/thumbnails/${Date.now()}_${file.name}`
      );
      await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setThumbnail(downloadURL);
      toast.success("Thumbnail uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload thumbnail");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    setIsUploadingImages(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const storageRef = ref(
          storage,
          `portfolio/images/${Date.now()}_${file.name}`
        );
        await uploadBytesResumable(storageRef, file);
        return await getDownloadURL(storageRef);
      });

      const newImageUrls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...newImageUrls]);
      toast.success(`${files.length} image(s) uploaded successfully!`);
    } catch (error) {
      toast.error("Failed to upload some images");
      console.error("Upload error:", error);
    } finally {
      setIsUploadingImages(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const removeThumbnail = () => {
    setThumbnail("");
  };

  const onSubmit = async (data: PortfolioFormValues) => {
    try {
      const portfolioData = {
        ...data,
        skills,
        thumbnail,
        images,
      };

      if (mode === "edit" && portfolio) {
        await apiClient.put(`/portfolios/${portfolio._id}`, portfolioData);
        toast.success("Portfolio updated successfully!");
        router.refresh();
        form.reset();
        router.push("/profile/seller/portfolios");
      } else {
        await apiClient.post("/portfolios", portfolioData);
        toast.success("Portfolio created successfully!");
        form.reset();
        setThumbnail("");
        setImages([]);
        setSkills([]);
      }

      router.refresh();
      router.push("/profile/seller/portfolios");
    } catch (error) {
      toast.error(`Failed to ${mode} portfolio`);
      console.error("Submission error:", error);
    }
  };

  const removeSkill = (indexToRemove: number) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Project Details Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. E-commerce Website" {...field} />
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
                    <FormLabel>Your role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Frontend Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Skills Section */}
              <div>
                <FormLabel className="mb-3">Skills and deliverables</FormLabel>
                <div className="space-y-3">
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
                    placeholder="Add skills (press Enter to add)"
                  />
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <div key={index} className="relative group">
                        <Button variant="secondary" size="sm" className="pr-8">
                          {skill}
                        </Button>
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full text-xs flex items-center justify-center transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <div
                        data-color-mode="light"
                        className="border rounded-lg overflow-hidden"
                      >
                        <MDEditor
                          value={field.value}
                          onChange={field.onChange}
                          previewOptions={{
                            rehypePlugins: [[rehypeSanitize]],
                          }}
                          height={400}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Minimum 300 characters. Markdown supported.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Thumbnail Upload Section */}
        <Card>
          <CardContent className="pt-6">
            <FormLabel className="mb-4 block">Project Thumbnail</FormLabel>
            <div className="space-y-4">
              {thumbnail ? (
                <div className="relative group">
                  <div className="relative aspect-video w-full max-w-2xl mx-auto border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                    <Image
                      src={thumbnail}
                      alt="Thumbnail preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                  <input
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                  />
                  <div className="flex flex-col items-center justify-center gap-3 text-center p-6">
                    {isUploading ? (
                      <BeatLoader size={8} />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400" />
                        <div>
                          <Text className="font-medium">
                            <span className="text-primary">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </Text>
                          <Text variant="gray" size="small">
                            Recommended: 1200×630px (JPG, PNG, WebP, max 50MB)
                          </Text>
                        </div>
                      </>
                    )}
                  </div>
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Images Section */}
        <Card>
          <CardContent className="pt-6">
            <FormLabel className="mb-4 block">Project Images</FormLabel>
            <div className="space-y-4">
              {/* Image Upload Area */}
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                <input
                  onChange={handleImagesUpload}
                  className="hidden"
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={isUploadingImages}
                />
                <div className="flex flex-col items-center justify-center gap-2 text-center p-4">
                  {isUploadingImages ? (
                    <BeatLoader size={8} />
                  ) : (
                    <>
                      <Plus className="w-6 h-6 text-gray-400" />
                      <div>
                        <Text size="small" className="font-medium">
                          Add project images
                        </Text>
                        <Text variant="gray" size="small">
                          Upload multiple images (JPG, PNG, WebP, max 50MB each)
                        </Text>
                      </div>
                    </>
                  )}
                </div>
              </label>

              {/* Image Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative group aspect-video rounded-lg overflow-hidden border"
                    >
                      <Image
                        src={image}
                        alt={`Project image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={
              form.formState.isSubmitting || isUploading || isUploadingImages
            }
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              form.formState.isSubmitting || isUploading || isUploadingImages
            }
            className="min-w-[160px]"
          >
            {form.formState.isSubmitting ? (
              <BeatLoader size={8} color="#ffffff" />
            ) : mode === "edit" ? (
              "Update Portfolio"
            ) : (
              "Create Portfolio"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
