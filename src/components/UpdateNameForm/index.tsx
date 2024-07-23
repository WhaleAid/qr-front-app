import { useUpdateMeMutation } from "@/services/userService";
import { Form, FormikProvider, useFormik } from "formik";
import { FC } from "react";
import * as yup from 'yup';

interface updateNameFormProps {

}

interface updateNameFormValues {
    company: string;
}


const UpdateNameForm: FC<updateNameFormProps> = () => {

    const [updateMe, { data, error, isLoading }] = useUpdateMeMutation();

    const handleSubmit = (values: updateNameFormValues) => {
        updateMe({ company: values.company });
    }

    const validationSchema = yup.object({
        company: yup.string().required('Champ requis'),
    })

    const formik = useFormik<updateNameFormValues>({
        initialValues: {
            company: "",
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    })
    return (
        <FormikProvider value={formik}>
            <Form className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="company" className="text-sm font-semibold text-gray-600">Nom de la société</label>
                    <input type="text" name="company" id="company" className="border border-gray-300 rounded-lg p-2" />
                </div>
                <button type="submit" className="bg-primary text-white rounded-lg p-2">Enregistrer</button>
            </Form>
        </FormikProvider>
    );
}

export default UpdateNameForm;