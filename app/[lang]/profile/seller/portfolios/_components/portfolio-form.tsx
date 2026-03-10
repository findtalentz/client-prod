"use client";
import { Button } from "@/components/ui/button";
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
import { IoAdd, IoClose } from "react-icons/io5";
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Project Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-gray-900">Project Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
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
                  <FormLabel>Your Role</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Frontend Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Skills */}
          <div>
            <FormLabel className="mb-2 block">Skills & Deliverables</FormLabel>
            <div className="flex items-center gap-2">
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 shrink-0"
                onClick={() => {
                  if (!skill.trim()) return;
                  setSkills([...skills, skill.trim()]);
                  setSkill("");
                }}
              >
                <IoAdd />
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <IoClose className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <div
                    data-color-mode="light"
                    className="border rounded-xl overflow-hidden"
                  >
                    <MDEditor
                      value={field.value}
                      onChange={field.onChange}
                      previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                      }}
                      height={200}
                    />
                  </div>
                </FormControl>
                <p className="text-xs text-gray-400 mt-1">
                  Minimum 30 characters. Markdown supported.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Thumbnail */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Thumbnail</h3>
          {thumbnail ? (
            <div className="relative group">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-100">
                <Image
                  src={thumbnail}
                  alt="Thumbnail preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
              <input
                onChange={handleThumbnailUpload}
                className="hidden"
                type="file"
                accept="image/*"
                disabled={isUploading}
              />
              {isUploading ? (
                <BeatLoader size={8} color="var(--primary)" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <Text className="font-medium text-sm">
                      <span className="text-primary">Click to upload</span>{" "}
                      thumbnail
                    </Text>
                    <Text variant="gray" size="small">
                      1200x630px recommended (JPG, PNG, WebP)
                    </Text>
                  </div>
                </div>
              )}
            </label>
          )}
        </div>

        {/* Project Images */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Project Images</h3>

          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
            <input
              onChange={handleImagesUpload}
              className="hidden"
              type="file"
              accept="image/*"
              multiple
              disabled={isUploadingImages}
            />
            {isUploadingImages ? (
              <BeatLoader size={8} color="var(--primary)" />
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <Plus className="w-5 h-5 text-gray-400" />
                <Text size="small" className="font-medium text-sm">
                  Add images
                </Text>
              </div>
            )}
          </label>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative group aspect-video rounded-xl overflow-hidden border border-gray-100"
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
                    className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
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
