import { useUpdateMeMutation, useUpdatePasswordMutation } from "@/services/userService";
import { Form, FormikProvider, useFormik } from "formik";
import { FC } from "react";
import * as yup from 'yup';

interface updatePasswordFormProps {

}

interface updatePasswordFormValues {
    password: string;
    newPassword: string;
    confirmPassword: string;
}


const UpdatePasswordForm: FC<updatePasswordFormProps> = () => {

    const [updatePassword, { data, error, isLoading }] = useUpdatePasswordMutation();

    const handleSubmit = (values: updatePasswordFormValues) => {
        updatePassword({ oldPassword: values.password, newPassword: values.newPassword });
    }

    const validationSchema = yup.object({
        password: yup.string().required('Champ requis'),
        newPassword: yup.string().required('Champ requis'),
        confirmPassword: yup.string().required('Champ requis').oneOf([yup.ref('newPassword')], 'Les mots de passe ne correspondent pas')
    })

    const formik = useFormik<updatePasswordFormValues>({
        initialValues: {
            password: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    })

    return (
        <FormikProvider value={formik}>
            <Form className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-sm font-semibold text-gray-600">Ancien mot de passe</label>
                    <input type="password" name="password" id="password" className="border border-gray-300 rounded-lg p-2" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="newPassword" className="text-sm font-semibold text-gray-600">Nouveau mot de passe</label>
                    <input type="password" name="newPassword" id="newPassword" className="border border-gray-300 rounded-lg p-2" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-600">Confirmer le mot de passe</label>
                    <input type="password" name="confirmPassword" id="confirmPassword" className="border border-gray-300 rounded-lg p-2" />
                </div>
                <button type="submit" className="bg-primary text-white rounded-lg p-2">Enregistrer</button>
            </Form>
        </FormikProvider>
    );
}

export default UpdatePasswordForm;