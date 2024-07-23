import { Form, FormikProvider, useFormik } from "formik";
import BtnCustom from "../btnCustom/btnCustom";
import * as yup from 'yup';
import { useParams } from "next/navigation";
import { useCreateCampaignMutation } from "@/services/campaignService";
import { notify } from "@/utils/notify";
import { CustomError } from "@/app/types/error";
import { Vortex } from "react-loader-spinner";

interface CampaignFormProps {
    onSubmitSuccess: () => void;
}

export default function CampaignForm({ onSubmitSuccess }: CampaignFormProps) {

    const clientId = useParams<{ id: string }>().id;

    const [createCampaign, { data, error, isLoading }] = useCreateCampaignMutation();


    interface CampaignFormValues {
        name: string,
        description: string,
    }

    const validationSchema = yup.object({
        name: yup.string().required('Champ requis'),
        description: yup.string().required('Champ requis')
    })

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit
    })

    async function handleSubmit(values: CampaignFormValues) {
        try {
            await createCampaign({ name: values.name, description: values.description, clientId: clientId }).unwrap();
            notify('Campagne créée', { icon: '✅', style: { background: '#fff', color: '#000' } });
            onSubmitSuccess();
        } catch (err: any) {
            notify((err as CustomError).data || "Une erreur s'est produite.", { icon: "❌", style: { background: "#fff", color: "#000" } });
        } finally {
            formik.resetForm();
        }
    }

    return (
        <div className="pr-4 pl-4 pb-4">
            <h2 className="font-bold text-xl text-black mb-4 w-full">
                {
                    isLoading ? 'Chargement...' : 'Créer une campagne'
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
                                <input onChange={formik.handleChange} value={formik.values.name} type="text" id="name" placeholder="Nom de la campagne" name="name" className="w-full py-2 px-4 bg-gray-100 rounded-lg border" />
                                {
                                    formik.touched.name && formik.errors.name ? (
                                        <span className="text-red-500 text-sm self-end">
                                            {formik.errors.name}
                                        </span>
                                    ) : null
                                }
                            </div>
                            <div className="w-full flex flex-col">
                                <textarea onChange={formik.handleChange} value={formik.values.description} id="description" placeholder="Description" name="description" className="w-full py-2 px-4 bg-gray-100 rounded-lg border" />
                                {
                                    formik.touched.description && formik.errors.description ? (
                                        <span className="text-red-500 text-sm self-end">
                                            {formik.errors.description}
                                        </span>
                                    ) : null
                                }
                            </div>
                            <BtnCustom
                                text="Créer"
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