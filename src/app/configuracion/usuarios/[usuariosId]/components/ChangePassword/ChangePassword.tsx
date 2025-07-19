"use client";
import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

interface UsuariosProps {
  usuarioId?: string;
  onClose: () => void;
}

export function ChangePassword(props: UsuariosProps) {
  const { usuarioId, onClose } = props;

  const [formData, setFormData] = useState<FormData>({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validatePassword = (password: string): string[] => {
    const issues = [];
    if (password.length < 8) issues.push("Mínimo 8 caracteres");
    if (!/[A-Z]/.test(password)) issues.push("Una mayúscula");
    if (!/[a-z]/.test(password)) issues.push("Una minúscula");
    if (!/\d/.test(password)) issues.push("Un número");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      issues.push("Un carácter especial");
    return issues;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar nueva contraseña
    if (!formData.newPassword) {
      newErrors.newPassword = "La nueva contraseña es requerida";
    } else {
      const passwordIssues = validatePassword(formData.newPassword);
      if (passwordIssues.length > 0) {
        newErrors.newPassword = `Falta: ${passwordIssues.join(", ")}`;
      }
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu nueva contraseña";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  const togglePasswordVisibility = (field: "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    const usuarioMod = {
      password: formData.newPassword,
    };

    try {
      // Aquí harías la llamada a tu API
      const response = await fetch(`/api/usuarios/${usuarioId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuarioMod),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al cambiar la contraseña");
      }

      setSuccess(true);
      setFormData({ newPassword: "", confirmPassword: "" });

      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccess(false); // Oculta el mensaje
        onClose(); // Cierra el diálogo
      }, 5000);
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "Error inesperado",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    const issues = validatePassword(password);
    if (!password) return { strength: 0, label: "" };
    if (issues.length === 0) return { strength: 100, label: "Muy fuerte" };
    if (issues.length <= 2) return { strength: 75, label: "Fuerte" };
    if (issues.length <= 3) return { strength: 50, label: "Media" };
    return { strength: 25, label: "Débil" };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Cambiar Contraseña
            </CardTitle>
            <CardDescription>
              Actualiza tu contraseña para mantener tu cuenta segura
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Mensaje de éxito */}
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    ¡Contraseña cambiada exitosamente!
                  </AlertDescription>
                </Alert>
              )}

              {/* Error general */}
              {errors.general && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              {/* Nueva contraseña */}
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) =>
                      handleInputChange("newPassword", e.target.value)
                    }
                    className={errors.newPassword ? "border-red-500" : ""}
                    placeholder="Ingresa tu nueva contraseña"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>

                {/* Indicador de fortaleza */}
                {formData.newPassword && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Fortaleza:</span>
                      <span
                        className={
                          passwordStrength.strength >= 75
                            ? "text-green-600"
                            : passwordStrength.strength >= 50
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.strength >= 75
                            ? "bg-green-500"
                            : passwordStrength.strength >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                  </div>
                )}

                {errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirmar contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  Confirmar Nueva Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={errors.confirmPassword ? "border-red-500" : ""}
                    placeholder="Confirma tu nueva contraseña"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}

                {/* Indicador de coincidencia */}
                {formData.confirmPassword && (
                  <div className="flex items-center gap-2 text-sm">
                    {formData.newPassword === formData.confirmPassword ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">
                          Las contraseñas coinciden
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-600">
                          Las contraseñas no coinciden
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Requisitos de contraseña */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Requisitos de contraseña:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Mínimo 8 caracteres</li>
                  <li>• Al menos una letra mayúscula</li>
                  <li>• Al menos una letra minúscula</li>
                  <li>• Al menos un número</li>
                  <li>• Al menos un carácter especial (!@#$%^&*)</li>
                </ul>
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Cambiando..." : "Cambiar Contraseña"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
