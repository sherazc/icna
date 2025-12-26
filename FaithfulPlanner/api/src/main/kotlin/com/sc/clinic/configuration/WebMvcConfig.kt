package com.sc.clinic.configuration

import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import org.springframework.core.io.Resource
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.web.servlet.resource.PathResourceResolver

@Configuration
class WebMvcConfig : WebMvcConfigurer {

    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        registry
            .addResourceHandler("/**")
            .addResourceLocations("classpath:/static/")
            .resourceChain(true)
            .addResolver(createSpaPathResolver())
    }

    private fun createSpaPathResolver(): PathResourceResolver {
        return object : PathResourceResolver() {
            override fun getResource(resourcePath: String, location: Resource): Resource {
                val requestResource = location.createRelative(resourcePath)
                return if (requestResource.exists() && requestResource.isReadable) requestResource
                else ClassPathResource("/static/index.html")
            }
        }
    }

    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/api/**")
    }
}