import { Form, FormikProvider, useFormik } from "formik";
import BtnCustom from "../btnCustom/btnCustom";
import * as yup from 'yup';
import { useParams } from "next/navigation";
import { useCreateCampaignMutation } from "@/services/campaignService";
import { notify } from "@/utils/notify";
import { CustomError } from "@/app/types/error";
import { Vortex } from "react-loader-spinner";
import { useGenerateCompletionMutation } from "@/services/generationService";
import { useGenerateImagesMutation } from "@/services/imageService";

interface GenerateFormProps {
    type: "completion" | "image";
    onSubmitSuccess: () => void;
}

export default function GenerateForm({ onSubmitSuccess, type }: GenerateFormProps) {

    const campaignId = useParams<{ id: string }>().id;
    const [generateCompletion, { data, error, isLoading }] = useGenerateCompletionMutation();
    const [generateImages, { data: imagesData, error: imagesError, isLoading: imagesLoading }] = useGenerateImagesMutation();

    interface GenerateFormValues {
        prompt: string,
    }

    const validationSchema = yup.object({
        prompt: yup.string().required('Champ requis')
    })

    const formik = useFormik({
        initialValues: {
            prompt: '',
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit
    })

    async function handleSubmit(values: GenerateFormValues) {
        try {
            if (type === 'image') {
                await generateImages({ prompt: values.prompt, campaignId }).unwrap();
                notify('Images générées', { icon: '✅', style: { background: '#fff', color: '#000' } });
                onSubmitSuccess();
                return;
            }
            await generateCompletion({ prompt: values.prompt, campaignId }).unwrap();
            notify('Generation créée', { icon: '✅', style: { background: '#fff', color: '#000' } });
            onSubmitSuccess();
        } catch (err: any) {
            notify((err as CustomError).data || "Une erreur s'est produite.", { icon: "❌", style: { background: "#fff", color: "#000" } });
        } finally {
            formik.resetForm();
        }
    }

    return (
        <div className="pr-4 pl-4 pb-4 w-full">
            <h2 className="font-bold text-xl text-black mb-4 w-full">
                {
                    isLoading ? 'Chargement...patientez quelques secondes' : type === 'completion' ? 'Créer une génération' : 'Générer des images'
                }
            </h2>
            {
                isLoading ? (
                    <div className="w-full flex justify-center items-center">
                        <Vortex
                            visible={true}
                            height="60"
                            width="60"
                            ariaLabel="vortex-loading"
                            wrapperStyle={{}}
                            wrapperClass="vortex-wrapper"
                            colors={['#7A63EB', '#5C9BEB', '#7A63EB', '#5C9BEB', '#7A63EB', '#5C9BEB']}
                        />
                    </div>
                ) : (
                    <FormikProvider value={formik}>
                        <Form className="w-full flex flex-col gap-6">
                            <div className="w-full flex flex-col">
                                <textarea onChange={formik.handleChange} value={formik.values.prompt} id="prompt" placeholder="Tapez les consignes" name="prompt" className="w-full py-2 px-4 bg-gray-100 rounded-lg border" />
                                {
                                    formik.touched.prompt && formik.errors.prompt ? (
                                        <span className="text-red-500 text-sm self-end">
                                            {formik.errors.prompt}
                                        </span>
                                    ) : null
                                }
                            </div>
                            <BtnCustom
                                text="Générer"
                                colorScheme="violet"
                                classname="w-fit mx-auto my-4 px-8 py-2 rounded-full cursor-pointer"
                                type="submit"
                                disabled={formik.isSubmitting || !formik.isValid}
                                onclick={() => {
                                    formik.handleSubmit();
                                }}
                            />
                        </Form>
                    </FormikProvider>
                )
            }
        </div>
    )
}